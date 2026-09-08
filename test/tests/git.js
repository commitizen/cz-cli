import { EventEmitter } from 'events';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('git helpers', () => {

  describe('log', () => {
    it('passes stdout to the callback on success', (done) => {
      const { log } = proxyquire('../../src/git/log', {
        child_process: { exec: (cmd, opts, cb) => cb(null, 'the log output', '') }
      });

      log('/repo', (out) => {
        expect(out).to.equal('the log output');
        done();
      });
    });

    it('throws when git errors', () => {
      const boom = new Error('not a git repository');
      const { log } = proxyquire('../../src/git/log', {
        child_process: { exec: (cmd, opts, cb) => cb(boom) }
      });

      expect(() => log('/repo', () => {})).to.throw(boom);
    });
  });

  describe('whatChanged', () => {
    it('passes stdout to the callback on success', (done) => {
      const { whatChanged } = proxyquire('../../src/git/whatChanged', {
        child_process: { exec: (cmd, opts, cb) => cb(null, 'A\tfile.txt', '') }
      });

      whatChanged('/repo', (out) => {
        expect(out).to.equal('A\tfile.txt');
        done();
      });
    });

    it('throws when git errors', () => {
      const boom = new Error('bad revision');
      const { whatChanged } = proxyquire('../../src/git/whatChanged', {
        child_process: { exec: (cmd, opts, cb) => cb(boom) }
      });

      expect(() => whatChanged('/repo', () => {})).to.throw(boom);
    });
  });

  describe('commit (non-hook mode)', () => {
    let child, spawn, warnStub, load;

    beforeEach(() => {
      child = new EventEmitter();
      spawn = sinon.stub().returns(child);
      warnStub = sinon.stub(console, 'warn');
      load = () => proxyquire('../../src/git/commit', {
        child_process: { spawn, execSync: sinon.stub() }
      }).commit;
    });

    afterEach(() => {
      warnStub.restore();
    });

    it('spawns "git commit -m <message>" plus any extra args', () => {
      load()('/repo', '  spaced message  ', { args: ['--no-verify'], quiet: true }, () => {});

      const [cmd, args, opts] = spawn.args[0];
      expect(cmd).to.equal('git');
      expect(args).to.deep.equal(['commit', '-m', 'spaced message', '--no-verify']);
      expect(opts).to.include({ cwd: '/repo', stdio: 'ignore' });
    });

    it('inherits stdio when not quiet', () => {
      load()('/repo', 'msg', {}, () => {});
      expect(spawn.args[0][2].stdio).to.equal('inherit');
    });

    it('reports child-process errors through the callback', (done) => {
      const boom = new Error('spawn ENOENT');
      load()('/repo', 'msg', {}, (err) => {
        expect(err).to.equal(boom);
        done();
      });
      child.emit('error', boom);
    });

    it('only calls the callback once even if error fires repeatedly and exit follows', () => {
      const cb = sinon.spy();
      load()('/repo', 'msg', {}, cb);
      child.emit('error', new Error('first'));
      child.emit('error', new Error('second'));
      child.emit('exit', 0);
      expect(cb.calledOnce).to.equal(true);
      expect(cb.args[0][0]).to.have.property('message', 'first');
    });

    it('resolves with null on a zero exit code', (done) => {
      load()('/repo', 'msg', {}, (err) => {
        expect(err).to.equal(null);
        done();
      });
      child.emit('exit', 0);
    });

    it('warns about git config and errors on exit code 128', (done) => {
      load()('/repo', 'msg', {}, (err) => {
        expect(err).to.be.instanceOf(Error);
        expect(err.code).to.equal(128);
        expect(warnStub.calledOnce).to.equal(true);
        expect(warnStub.args[0][0]).to.match(/git config --global user\.email/);
        done();
      });
      child.emit('exit', 128, null);
    });

    it('errors (without the config warning) on a non-128 non-zero exit code', (done) => {
      load()('/repo', 'msg', {}, (err) => {
        expect(err).to.be.instanceOf(Error);
        expect(err.code).to.equal(1);
        expect(err.signal).to.equal('SIGABRT');
        expect(warnStub.called).to.equal(false);
        done();
      });
      child.emit('exit', 1, 'SIGABRT');
    });
  });

  describe('commit (--hook mode)', () => {
    it('writes the message to <git-dir>/COMMIT_EDITMSG', (done) => {
      const writes = [];
      const { commit } = proxyquire('../../src/git/commit', {
        child_process: { execSync: () => '/repo/.git\n', spawn: () => {} },
        fs: {
          openSync: () => 42,
          closeSync: () => {},
          writeFileSync: (fd, data) => writes.push([fd, data])
        }
      });

      commit('/repo', '   hook message   ', { hookMode: true }, (err) => {
        expect(err).to.equal(null);
        expect(writes).to.deep.equal([[42, 'hook message']]);
        done();
      });
    });

    it('falls back to "r+" when the file cannot be opened for "w" (Windows hidden files)', (done) => {
      const opened = [];
      const { commit } = proxyquire('../../src/git/commit', {
        child_process: { execSync: () => '/repo/.git', spawn: () => {} },
        fs: {
          openSync: (p, flags) => {
            opened.push(flags);
            if (flags === 'w') {
              throw new Error('EPERM');
            }
            return 7;
          },
          closeSync: () => {},
          writeFileSync: () => {}
        }
      });

      commit('/repo', 'msg', { hookMode: true }, (err) => {
        expect(err).to.equal(null);
        expect(opened).to.deep.equal(['w', 'r+']);
        done();
      });
    });

    it('reports the error (and still closes the fd) when the write fails', (done) => {
      let closed = false;
      const { commit } = proxyquire('../../src/git/commit', {
        child_process: { execSync: () => '/repo/.git', spawn: () => {} },
        fs: {
          openSync: () => 3,
          closeSync: () => { closed = true; },
          writeFileSync: () => { throw new Error('disk full'); }
        }
      });

      commit('/repo', 'msg', { hookMode: true }, (err) => {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('disk full');
        expect(closed).to.equal(true);
        done();
      });
    });

    it('reports the error when even the "r+" fallback fails', (done) => {
      const { commit } = proxyquire('../../src/git/commit', {
        child_process: { execSync: () => '/repo/.git', spawn: () => {} },
        fs: {
          openSync: () => { throw new Error('nope'); },
          closeSync: () => {},
          writeFileSync: () => {}
        }
      });

      commit('/repo', 'msg', { hookMode: true }, (err) => {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('nope');
        done();
      });
    });
  });
});

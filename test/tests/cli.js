import { expect } from 'chai';
import { EventEmitter } from 'events';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('cli', () => {

  describe('git-cz', () => {
    let bootstrap;
    let fakeStrategies, fakeCommitizen;

    beforeEach(() => {
      fakeStrategies = {
        git: sinon.spy(),
        gitCz: sinon.spy()
      }

      fakeCommitizen = {
        configLoader: {
          load: sinon.stub()
        }
      }

      bootstrap = proxyquire('../../src/cli/git-cz', {
        './strategies': fakeStrategies,
        '../commitizen': fakeCommitizen
      }).bootstrap;
    });

    describe('bootstrap', () => {
      describe('when config is provided', () => {
        it('passes config to useGitCzStrategy', () => {
          const config = sinon.spy();

          bootstrap({ config });

          expect(fakeStrategies.gitCz.args[0][2]).to.equal(config);
        });
      });

      describe('when config is not provided', () => {

        describe('and the config is returned from configLoader.load', () => {
          it('uses config from configLoader.load()', () => {
            const config = sinon.stub();
            fakeCommitizen.configLoader.load.returns(config);

            bootstrap({});

            expect(fakeStrategies.gitCz.args[0][2]).to.equal(config);
          });
        });

        describe('and the config is not returned from configLoader.load', () => {
          it('tells commitizen to use the git strategy', () => {
            bootstrap({});
            expect(fakeStrategies.git.called).to.equal(true);
          });
        });
      });

      describe('when argv is overridden', () => {
        it('uses the overridden argv', () => {
          bootstrap({}, ['node', 'git-cz', 'index.js']);
          expect(fakeStrategies.git.args[0][0][0]).to.equal('index.js');
        });
      })

      describe('when called with no arguments', () => {
        it('defaults environment to {} and argv to process.argv', () => {
          expect(() => bootstrap()).to.not.throw();
          expect(fakeStrategies.git.calledOnce).to.equal(true);
        });
      });
    });
  });

  describe('commitizen', () => {
    let bootstrap;
    let fakeInit, fakeParser, logStub, errorStub;

    beforeEach(() => {
      fakeInit = sinon.stub();
      fakeParser = { parse: sinon.stub() };
      logStub = sinon.stub(console, 'log');
      errorStub = sinon.stub(console, 'error');

      bootstrap = proxyquire('../../src/cli/commitizen', {
        '../commitizen': { init: fakeInit },
        './parsers': { commitizen: fakeParser }
      }).bootstrap;
    });

    afterEach(() => {
      logStub.restore();
      errorStub.restore();
    });

    it('slices argv down to the raw git args before parsing', () => {
      fakeParser.parse.returns({ _: [] });

      bootstrap({}, ['node', 'commitizen', 'init', 'cz-foo', '--save']);

      expect(fakeParser.parse.calledWith(['init', 'cz-foo', '--save'])).to.equal(true);
    });

    it('defaults environment and argv when called with no arguments', () => {
      fakeParser.parse.returns({ _: [] });

      expect(() => bootstrap()).to.not.throw();

      expect(fakeParser.parse.calledWith(process.argv.slice(2))).to.equal(true);
    });

    describe('init command', () => {
      it('calls init() with cwd, the adapter name and the parsed args', () => {
        const parsed = { _: ['init', 'cz-foo'], save: true };
        fakeParser.parse.returns(parsed);

        bootstrap({});

        expect(fakeInit.calledOnce).to.equal(true);
        expect(fakeInit.args[0][0]).to.equal(process.cwd());
        expect(fakeInit.args[0][1]).to.equal('cz-foo');
        expect(fakeInit.args[0][2]).to.equal(parsed);
      });

      it('logs, but does not throw, when init() fails', () => {
        fakeParser.parse.returns({ _: ['init', 'cz-foo'] });
        fakeInit.throws(new Error('kaboom'));

        expect(() => bootstrap({})).to.not.throw();
        expect(errorStub.calledOnce).to.equal(true);
        expect(errorStub.args[0][0]).to.match(/Error: Error: kaboom/);
      });

      it('errors when no adapter name is provided', () => {
        fakeParser.parse.returns({ _: ['init'] });

        bootstrap({});

        expect(fakeInit.called).to.equal(false);
        expect(errorStub.args[0][0]).to.match(/must provide an adapter name/i);
      });
    });

    describe('any other invocation', () => {
      it('prints usage help and runs no command', () => {
        fakeParser.parse.returns({ _: [] });

        bootstrap({});

        expect(fakeInit.called).to.equal(false);
        expect(logStub.called).to.equal(true);
        expect(logStub.args[0][0]).to.match(/Commitizen has two command line tools/);
      });

      it('prints usage help for an unknown command', () => {
        fakeParser.parse.returns({ _: ['wat'] });

        bootstrap({});

        expect(logStub.args[0][0]).to.match(/Detailed usage/);
      });
    });
  });

  describe('strategies barrel', () => {
    it('re-exports the git and git-cz strategies', () => {
      const strategies = require('../../src/cli/strategies');
      expect(strategies.git).to.be.a('function');
      expect(strategies.gitCz).to.be.a('function');
    });
  });

  describe('parsers barrel', () => {
    it('re-exports the git-cz and commitizen parsers', () => {
      const parsers = require('../../src/cli/parsers');
      expect(parsers.gitCz.parse).to.be.a('function');
      expect(parsers.commitizen.parse).to.be.a('function');
    });
  });

  describe('strategies/git', () => {
    let git, fakeChildProcess, fakeChild, errorStub;

    beforeEach(() => {
      fakeChild = new EventEmitter();
      fakeChildProcess = { spawn: sinon.stub().returns(fakeChild) };
      errorStub = sinon.stub(console, 'error');

      git = proxyquire('../../src/cli/strategies/git', {
        child_process: fakeChildProcess
      }).default;
    });

    afterEach(() => {
      errorStub.restore();
    });

    it('spawns "git commit" with the raw args and inherited stdio', () => {
      git(['-m', 'wip'], {});

      expect(fakeChildProcess.spawn.calledOnce).to.equal(true);
      const [cmd, args, opts] = fakeChildProcess.spawn.args[0];
      expect(cmd).to.equal('git');
      expect(args).to.deep.equal(['commit', '-m', 'wip']);
      expect(opts).to.deep.equal({ stdio: 'inherit' });
    });

    it('rethrows when the child process emits an error', () => {
      git([], {});

      const boom = new Error('spawn failed');
      expect(() => fakeChild.emit('error', boom)).to.throw(boom);
      expect(errorStub.calledWith(boom)).to.equal(true);
    });

    it('does not spawn git in debug mode, it just logs', () => {
      git(['-m', 'wip'], { debug: true });

      expect(fakeChildProcess.spawn.called).to.equal(false);
      expect(errorStub.args[0][0]).to.match(/COMMITIZEN DEBUG: No cz friendly config/);
    });
  });

  describe('strategies/git-cz', () => {
    let gitCz, logStub;
    let fakeParsers, fakeCommitizen, fakeGitStrategy, fakeFindRoot, fakeInquirer, fakeUtil;

    function load () {
      gitCz = proxyquire('../../src/cli/strategies/git-cz', {
        '../parsers': fakeParsers,
        '../../commitizen': fakeCommitizen,
        './git': fakeGitStrategy,
        'find-root': fakeFindRoot,
        inquirer: fakeInquirer,
        '../../common/util': fakeUtil
      }).default;
    }

    beforeEach(() => {
      logStub = sinon.stub(console, 'log');
      fakeParsers = {
        gitCz: { parse: sinon.stub().returnsArg(0) },
        commitizen: { parse: sinon.stub().returns({}) }
      };
      fakeGitStrategy = { default: sinon.spy() };
      fakeFindRoot = sinon.stub().returns('/adapter/root');
      fakeInquirer = {};
      fakeUtil = {
        getParsedPackageJsonFromPath: sinon.stub().returns({ name: 'cz-fake', version: '1.0.0' })
      };
      fakeCommitizen = {
        commit: sinon.spy(),
        staging: { isClean: sinon.stub().callsArgWith(1, null, false) },
        adapter: {
          getPrompter: sinon.stub().returns(() => {}),
          resolveAdapterPath: sinon.stub().returns('/adapter/root/index.js'),
          getGitRootPath: sinon.stub().returns('/git/root')
        }
      };
      load();
    });

    afterEach(() => {
      logStub.restore();
    });

    it('delegates to the plain git strategy when --amend is present', () => {
      fakeParsers.commitizen.parse.returns({ amend: true });

      gitCz(['--amend'], { cliPath: '/cli' }, { path: './adapter' });

      expect(fakeGitStrategy.default.calledOnce).to.equal(true);
      expect(fakeCommitizen.commit.called).to.equal(false);
    });

    it('runs the commit flow, wiring the prompter and options through', () => {
      gitCz(['file.js'], { cliPath: '/cli' }, { path: './adapter' });

      expect(fakeCommitizen.commit.calledOnce).to.equal(true);
      const [inquirerArg, gitRoot, prompter, options] = fakeCommitizen.commit.args[0];
      expect(inquirerArg).to.equal(fakeInquirer);
      expect(gitRoot).to.equal('/git/root');
      expect(prompter).to.be.a('function');
      expect(options).to.include({
        disableAppendPaths: true,
        emitData: true,
        quiet: false,
        retryLastCommit: false,
        hookMode: false
      });
    });

    it('flags retryLastCommit when the first arg is --retry', () => {
      gitCz(['--retry'], { cliPath: '/cli' }, { path: './adapter' });
      expect(fakeCommitizen.commit.args[0][3].retryLastCommit).to.equal(true);
    });

    it('flags hookMode when --hook was parsed', () => {
      fakeParsers.commitizen.parse.returns({ hook: true });
      gitCz([], { cliPath: '/cli' }, { path: './adapter' });
      expect(fakeCommitizen.commit.args[0][3].hookMode).to.equal(true);
    });

    it('stages all files when -a / --all is passed', () => {
      gitCz(['-a'], { cliPath: '/cli' }, { path: './adapter' });
      expect(fakeCommitizen.staging.isClean.args[0][2]).to.equal(true);
    });

    it('throws when the staging area is clean and --allow-empty is absent', () => {
      fakeCommitizen.staging.isClean.callsArgWith(1, null, true);

      expect(() => gitCz([], { cliPath: '/cli' }, { path: './adapter' }))
        .to.throw(/No files added to staging/);
      expect(fakeCommitizen.commit.called).to.equal(false);
    });

    it('proceeds when the staging area is clean but --allow-empty is present', () => {
      fakeCommitizen.staging.isClean.callsArgWith(1, null, true);

      gitCz(['--allow-empty'], { cliPath: '/cli' }, { path: './adapter' });
      expect(fakeCommitizen.commit.calledOnce).to.equal(true);
    });

    it('rethrows an error from the staging check', () => {
      const boom = new Error('git diff failed');
      fakeCommitizen.staging.isClean.callsArgWith(1, boom);

      expect(() => gitCz([], { cliPath: '/cli' }, { path: './adapter' })).to.throw(boom);
    });

    it('rethrows an error surfaced by the commit callback', () => {
      const boom = new Error('commit failed');
      fakeCommitizen.commit = sinon.stub().callsArgWith(4, boom);
      load();

      expect(() => gitCz(['file.js'], { cliPath: '/cli' }, { path: './adapter' })).to.throw(boom);
    });

    it('exits with code 0 when the commit succeeds', () => {
      const exitStub = sinon.stub(process, 'exit');
      try {
        fakeCommitizen.commit = sinon.stub().callsArgWith(4, null);
        load();

        gitCz(['file.js'], { cliPath: '/cli' }, { path: './adapter' });

        expect(exitStub.calledWith(0)).to.equal(true);
      } finally {
        exitStub.restore();
      }
    });
  });

});

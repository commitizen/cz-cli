import path from 'path';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

// The cache dir is stubbed below; the source builds the file path with
// `path.join`, so derive the expected value the same way to stay OS-agnostic.
const cachePath = path.join('/cache/dir', 'commitizen.json');

describe('commitizen commit (unit)', () => {

  let gitCommit, cache, ensureDir, logStub, errorStub, load;

  beforeEach(() => {
    gitCommit = sinon.stub();
    cache = {
      getCacheValueSync: sinon.stub(),
      setCacheValueSync: sinon.stub()
    };
    ensureDir = sinon.stub().callsArgWith(1, null);
    logStub = sinon.stub(console, 'log');
    errorStub = sinon.stub(console, 'error');

    load = () => proxyquire('../../src/commitizen/commit', {
      cachedir: () => '/cache/dir',
      'fs-extra': { ensureDir },
      '../git': { commit: gitCommit },
      './cache': cache
    }).default;
  });

  afterEach(() => {
    logStub.restore();
    errorStub.restore();
  });

  it('logs and bails when the cache directory cannot be created', () => {
    ensureDir.callsArgWith(1, new Error('EACCES'));
    const done = sinon.spy();

    load()({}, '/repo', () => {}, {}, done);

    expect(errorStub.calledOnce).to.equal(true);
    expect(errorStub.args[0][0]).to.match(/Couldn't create commitizen cache directory/);
    expect(done.called).to.equal(false);
    expect(gitCommit.called).to.equal(false);
  });

  it('runs the prompter and commits the message it returns, caching the attempt', () => {
    gitCommit.callsArgWith(3, null);
    const prompter = (inquirer, cb) => cb('feat: a thing', { '--no-verify': true });
    const done = sinon.spy();
    const options = { quiet: true };

    load()({}, '/repo', prompter, options, done);

    expect(cache.setCacheValueSync.calledOnce).to.equal(true);
    expect(cache.setCacheValueSync.args[0][0]).to.equal(cachePath);
    expect(cache.setCacheValueSync.args[0][1]).to.equal('/repo');
    expect(cache.setCacheValueSync.args[0][2]).to.deep.equal({
      template: 'feat: a thing',
      options,
      overrideOptions: { '--no-verify': true }
    });

    const [repoPath, message, mergedOptions] = gitCommit.args[0];
    expect(repoPath).to.equal('/repo');
    expect(message).to.equal('feat: a thing');
    expect(mergedOptions).to.deep.equal({ quiet: true, '--no-verify': true });
    expect(done.calledWith(null, 'feat: a thing')).to.equal(true);
  });

  it('propagates an Error raised by the adapter prompter without committing', () => {
    const boom = new Error('adapter said no');
    const prompter = (inquirer, cb) => cb(boom);
    const done = sinon.spy();

    load()({}, '/repo', prompter, {}, done);

    expect(done.calledOnceWith(boom)).to.equal(true);
    expect(cache.setCacheValueSync.called).to.equal(false);
    expect(gitCommit.called).to.equal(false);
  });

  it('replays the previous attempt from cache when retryLastCommit is set', () => {
    cache.getCacheValueSync.returns({
      template: 'fix: cached message',
      options: { a: 1 },
      overrideOptions: { b: 2 }
    });
    gitCommit.callsArgWith(3, null);
    const done = sinon.spy();
    const prompter = sinon.spy();

    load()({}, '/repo', prompter, { retryLastCommit: true }, done);

    expect(prompter.called).to.equal(false);
    expect(logStub.args[0][0]).to.match(/Retrying last commit attempt/);
    expect(cache.getCacheValueSync.calledWith(cachePath, '/repo')).to.equal(true);

    const [repoPath, message, mergedOptions] = gitCommit.args[0];
    expect(repoPath).to.equal('/repo');
    expect(message).to.equal('fix: cached message');
    expect(mergedOptions).to.deep.equal({ a: 1, b: 2 });
    expect(done.calledWith(null, 'fix: cached message')).to.equal(true);
  });
});

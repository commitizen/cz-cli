import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

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
  });
});

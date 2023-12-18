import { expect } from 'chai';
import path from 'path';

// TODO: augment these tests with tests using the actual cli call
// For now we're just using the library, which is probably fine
// in the short term
import { adapter, init as commitizenInit } from '../../src/commitizen';

import { isFunction } from '../../src/common/util';

// Bootstrap our tester
import { bootstrap } from '../tester';

// Destructure some things based on the bootstrap process
let { config, repo, clean } = bootstrap();

before(function () {
  // Creates the temp path
  clean.before(config.paths.tmp);
});

beforeEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(config.paths.endUserRepo);
});

describe('adapter', function () {

  it('resolves adapter paths', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Describe a repo and some files to add and commit
    let repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        dummyfile: {
          contents: `duck-duck-goose`,
          filename: `mydummyfile.txt`,
        },
        gitignore: {
          contents: `node_modules/`,
          filename: `.gitignore`
        }
      }
    };

    // Describe an adapter
    let adapterConfig = {
      path: path.join(repoConfig.path, '/node_modules/cz-conventional-changelog'),
      npmName: 'cz-conventional-changelog'
    };

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog');

    // TEST
    expect(function () {
      adapter.resolveAdapterPath({
        config: adapterConfig,
        filepath: 'IAMANIMPOSSIBLEPATH',
      });
    }).to.throw;

    expect(function () {
      adapter.resolveAdapterPath({
        config: adapterConfig,
        filepath: null,
      });
    }).not.to.throw;
    expect(function () {
      adapter.resolveAdapterPath({
        config: {
          path: './node_modules/cz-conventional-changelog',
          npmName: 'cz-conventional-changelog'
        },
        filepath: repoConfig.path,
      });
    }).not.to.throw;

    expect(function () {
      adapter.resolveAdapterPath({
        config: adapterConfig,
        filepath: repoConfig.path,
      });
    }).not.to.throw;

    expect(function () {
      adapter.resolveAdapterPath({
        config: {
          path: 'cz-conventional-changelog',
        },
        filepath: repoConfig.path,
      });
    }).not.to.throw;

    expect(function () {
      adapter.resolveAdapterPath({
        config: {
          path: 'cz-conventional-changelog'
        },
        filepath: null,
      });
    }).not.to.throw(Error);
  });

  it('resolves scoped adapter paths', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Describe a repo and some files to add and commit
    let repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        dummyfile: {
          contents: `duck-duck-goose`,
          filename: `mydummyfile.txt`,
        },
        gitignore: {
          contents: `node_modules/`,
          filename: `.gitignore`
        }
      }
    };

    // Describe an adapter
    let adapterConfig = {
      path: path.join(repoConfig.path, '/node_modules/@commitizen/cz-conventional-changelog'),
      npmName: '@commitizen/cz-conventional-changelog'
    };

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, '@commitizen/cz-conventional-changelog');

    // TEST
    expect(function () {
      adapter.resolveAdapterPath({
        config: adapterConfig,
        filepath: 'IAMANIMPOSSIBLEPATH',
      });
    }).to.throw;
    expect(function () {
      adapter.resolveAdapterPath({
        config: adapterConfig,
        filepath: null,
      });
    }).not.to.throw;
    expect(function () {
      adapter.resolveAdapterPath({
        config: {
          path: './node_modules/@commitizen/cz-conventional-changelog',
        },
        filepath: repoConfig.path,
      });
    }).not.to.throw;

    expect(function () {
      adapter.resolveAdapterPath({
        config: {
          path: '@commitizen/cz-conventional-changelog',
        },
        filepath: repoConfig.path,
      });
    }).not.to.throw;
  });

  it.skip('gets adapter prompter functions', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Describe a repo and some files to add and commit
    let repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        dummyfile: {
          contents: `duck-duck-goose`,
          filename: `mydummyfile.txt`,
        },
        gitignore: {
          contents: `node_modules/`,
          filename: `.gitignore`
        }
      }
    };

    // Describe an adapter
    let adapterConfig = {
      path: path.join(repoConfig.path, '/node_modules/cz-conventional-changelog'),
      npmName: 'cz-conventional-changelog'
    };

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { includeCommitizen: true });

    // TEST
    expect(function () {
      adapter.getPrompter('IAMANIMPOSSIBLEPATH');
    }).to.throw(Error);
    expect(function () {
      adapter.getPrompter(adapterConfig.path);
    }).not.to.throw(Error);
    expect(isFunction(adapter.getPrompter(adapterConfig.path))).to.be.true;
  });

  it('gets adapter prompter functions for default export adapters', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Describe a repo and some files to add and commit
    let repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        dummyfile: {
          contents: `duck-duck-goose`,
          filename: `mydummyfile.txt`,
        },
        gitignore: {
          contents: `node_modules/`,
          filename: `.gitignore`
        }
      }
    };

    // Describe an adapter
    let adapterConfig = {
      path: path.join(repoConfig.path, '/node_modules/cz-conventional-changelog-default-export'),
      npmName: 'cz-conventional-changelog-default-export'
    };

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog-default-export');

    // TEST
    expect(function () {
      adapter.getPrompter({
        config: adapterConfig,
        filepath: 'IAMANIMPOSSIBLEPATH',
      });
    }).to.throw;
    expect(function () {
      adapter.getPrompter({
        config: adapterConfig,
        filepath: null,
      });
    }).not.to.throw;
    expect(function () {
      adapter.getPrompter({
        config: adapterConfig,
        filepath: repoConfig.path,
      });
    }).not.to.throw;
    expect(function () {
      adapter.getPrompter({
        config: {
          path: 'cz-conventional-changelog-default-export'
        },
        filepath: repoConfig.path,
      });
    }).not.to.throw;

    expect(isFunction(adapter.getPrompter({
      config: adapterConfig,
      filepath: null,
    }))).to.be.true;
  });

});

afterEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // All this should do is archive the tmp path to the artifacts
  clean.afterEach(config.paths.tmp, config.preserve);
});

after(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // Once everything is done, the artifacts should be cleaned up based on
  // the preserve setting in the config
  clean.after(config.paths.tmp, config.preserve);
});

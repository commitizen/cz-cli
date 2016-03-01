import {expect} from 'chai';
import path from 'path';

// TODO: augment these tests with tests using the actual cli call
// For now we're just using the library, which is probably fine
// in the short term
import {adapter, init as commitizenInit} from '../../src/commitizen';

import {isFunction} from '../../src/common/util';

// Bootstrap our tester
import {bootstrap} from '../tester';

// Destructure some things based on the bootstrap process
let {config, sh, repo, clean, util} = bootstrap();

before(function() {
  // Creates the temp path
  clean.before(sh, config.paths.tmp);
});

beforeEach(function() {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(sh, config.paths.endUserRepo);
});

describe('adapter', function() {
  
  it('resolves adapter paths', function() {
    
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
    commitizenInit(sh, config.paths.endUserRepo, 'cz-conventional-changelog');
    
    // TEST 
    expect(function() {adapter.resolveAdapterPath('IAMANIMPOSSIBLEPATH'); }).to.throw(Error);
    expect(function() {adapter.resolveAdapterPath(adapterConfig.path); }).not.to.throw(Error);
    expect(function() {adapter.resolveAdapterPath(path.join(adapterConfig.path, 'index.js')); }).not.to.throw(Error);
    expect(function() {adapter.resolveAdapterPath('cz-conventional-changelog'); }).not.to.throw(Error);
  });
  
  it('gets adapter prompter functions', function(){
    
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
    commitizenInit(sh, config.paths.endUserRepo, 'cz-conventional-changelog');
    
    // TEST 
    expect(function() {adapter.getPrompter('IAMANIMPOSSIBLEPATH'); }).to.throw(Error);
    expect(function() {adapter.getPrompter(adapterConfig.path); }).not.to.throw(Error);
    expect(isFunction(adapter.getPrompter(adapterConfig.path))).to.be.true; 
  });

});

afterEach(function() {
  // All this should do is archive the tmp path to the artifacts
  clean.afterEach(sh, config.paths.tmp, config.preserve);
}); 

after(function() {
  // Once everything is done, the artifacts should be cleaned up based on 
  // the preserve setting in the config
  clean.after(sh, config.paths.tmp, config.preserve);
}); 
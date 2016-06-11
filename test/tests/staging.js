import {expect} from 'chai';
import path from 'path';
import fs from 'fs';


// Bootstrap our tester
import {bootstrap} from '../tester';

// Get our source files
import {init as gitInit, addPath as gitAdd, log} from '../../src/git';
import {init as commitizenInit, staging} from '../../src/commitizen';

// Destructure some things for cleaner tests
let { config, sh, repo, clean, util, files } = bootstrap();
let { writeFilesToPath } = files;

before(function() {
  // Creates the temp path
  clean.before(sh, config.paths.tmp);
});

beforeEach(function() {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(sh, config.paths.endUserRepo);
});

describe('staging', function() {
  
  it('should determine if a repo is clean', function(done) {
    
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
    
    gitInit(sh, repoConfig.path);
    
    staging.isClean('./@this-actually-does-not-exist', function(stagingError) {
      expect(stagingError).to.be.an.instanceof(Error);
    
      staging.isClean(repoConfig.path, function(stagingIsCleanError, stagingIsClean) {
        expect(stagingIsCleanError).to.be.null;
        expect(stagingIsClean).to.be.true;
        
        writeFilesToPath(repoConfig.files, repoConfig.path);
        
        gitAdd(sh, repoConfig.path);
        
        staging.isClean(repoConfig.path, function(afterWriteStagingIsCleanError, afterWriteStagingIsClean) {
          expect(afterWriteStagingIsCleanError).to.be.null;
          expect(afterWriteStagingIsClean).to.be.false;
          done();
        });
        
      });
    });
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

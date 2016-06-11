import {expect} from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import _ from 'lodash';

import inquirer from 'inquirer';

// Bootstrap our tester
import {bootstrap} from '../tester';

// Get our source files
import {addPath as gitAdd, commit as gitCommit, init as gitInit, log} from '../../src/git';
import {commit as commitizenCommit, init as commitizenInit, adapter} from '../../src/commitizen';

// Destructure some things for cleaner tests
let { config, sh, repo, clean, util, files } = bootstrap();
let { writeFilesToPath } = files;
let { getPrompter } = adapter;

before(function() {
  // Creates the temp path
  clean.before(sh, config.paths.tmp);
});

beforeEach(function() {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(sh, config.paths.endUserRepo);
});

describe('commit', function() {
  
  it('should commit simple messages', function(done) {
    
    this.timeout(config.maxTimeout); // this could take a while
    
    // SETUP
    
    let dummyCommitMessage = `sip sip sippin on some sizzurp`;
    
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
      path: path.join(repoConfig.path, '/node_modules/cz-jira-smart-commit'),
      npmName: 'cz-jira-smart-commit'
    };
    
    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage);
    // TEST
   
    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, {disableAppendPaths:true, quiet:true, emitData:true}, function() {
      log(repoConfig.path, function(logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });
  
  it('should commit message with quotes', function(done) {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    let dummyCommitMessage = `sip \`sip\` sippin' on some "sizzurp"`;

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
      path: path.join(repoConfig.path, '/node_modules/cz-jira-smart-commit'),
      npmName: 'cz-jira-smart-commit'
    };

    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage);
    // TEST

    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, {disableAppendPaths:true, quiet:true, emitData:true}, function() {
      log(repoConfig.path, function(logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });


  it('should commit multiline messages', function(done) {
    
    this.timeout(config.maxTimeout); // this could take a while
    
    // SETUP
    
    // Don't trim or delete the spacing in this commit message!
    
    // Git on *nix retains spaces on lines with only spaces
    // The blank line of this block should have 4 spaces.
    let nixCommitMessage =
    `sip sip sippin on jnkjnkjn
    
    some sizzurp`;
    
    // Git on win32 removes spaces from lines with only spaces
    // The blank line of this block should have no spaces
    let windowsCommitMessage =
    `sip sip sippin on jnkjnkjn

    some sizzurp`;
    
    let dummyCommitMessage = (os.platform == 'win32') ? windowsCommitMessage : nixCommitMessage;
    
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
    
    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage);
    // TEST
   
    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, {disableAppendPaths:true, quiet:true}, function() {
      log(repoConfig.path, function(logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });

  it('should allow to override git commit options', function(done) {
    
    this.timeout(config.maxTimeout); // this could take a while
    
    // SETUP
    
    let dummyCommitMessage = `sip sip sippin on some sizzurp`;
    let author = `A U Thor <author@example.com>`;
    
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
      path: path.join(repoConfig.path, '/node_modules/cz-jira-smart-commit'),
      npmName: 'cz-jira-smart-commit'
    };
    
    let options = {
      args: `--author="${author}" --no-edit`
    };
    
    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage, options);
    // TEST
   
    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, {disableAppendPaths:true, quiet:true, emitData:true}, function() {
      log(repoConfig.path, function(logOutput) {
        expect(logOutput).to.have.string(author);
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
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

/**
  * This is just a helper for testing. NOTE that prompter
  * prompter is overriden for testing purposes.
  */
function quickPrompterSetup(sh, repoConfig, adapterConfig, commitMessage, options={}) {
  
  commitizenInit(sh, repoConfig.path, adapterConfig.npmName);
  
  // NOTE:
  // In our real code we'd use this here but since we're testing,
  // we'll provide prompter. We'd normally use:
  //   let prompter = getPrompter(adapterConfig.path);
  let prompter = function(cz, commit) {
    commit(commitMessage, options);
  }
  
  gitInit(sh, repoConfig.path);
  
  writeFilesToPath(repoConfig.files, repoConfig.path);
  
  gitAdd(sh, repoConfig.path);
  
  // NOTE: In the real world we would not be returning
  // this we would instead be just making the commented
  // out getPrompter() call to get user input (above).
  return prompter;
}

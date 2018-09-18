/* eslint-env mocha */

import { expect } from 'chai';
import os from 'os';
import path from 'path';

import inquirer from 'inquirer';

// Bootstrap our tester
import { bootstrap } from '../tester';

// Get our source files
import { addFile as gitAddFile, init as gitInit, log, whatChanged } from '../../src/git';
import { commit as commitizenCommit, init as commitizenInit } from '../../src/commitizen';

// Destructure some things for cleaner tests
let { config, sh, repo, clean, files } = bootstrap();
let { writeFilesToPath } = files;

before(function () {
  // Creates the temp path
  clean.before(sh, config.paths.tmp);
});

beforeEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  /* istanbul ignore next */
  repo.createEndUser(sh, config.paths.endUserRepo);
});

describe('commit', function () {

  it('should commit simple messages', function (done) {

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
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, { disableAppendPaths: true, quiet: true, emitData: true }, function () {
      log(repoConfig.path, function (logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });

  it('should commit message with quotes', function (done) {

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
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, { disableAppendPaths: true, quiet: true, emitData: true }, function () {
      log(repoConfig.path, function (logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });

  it('should commit multiline messages', function (done) {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Git on *nix retains spaces on lines with only spaces
    // Git on win32 removes spaces from lines with only spaces
    let dummyCommitMessage =
    `sip sip sippin on jnkjnkjn
${(os.platform === 'win32') ? '' : '    '}
    some sizzurp`;

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
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, { disableAppendPaths: true, quiet: true }, function () {
      log(repoConfig.path, function (logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });

  it('should allow to override git commit options', function (done) {

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
      args: [`--author="${author}"`, '--no-edit']
    };

    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage, options);
    // TEST

    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, { disableAppendPaths: true, quiet: true, emitData: true }, function () {
      log(repoConfig.path, function (logOutput) {
        expect(logOutput).to.have.string(author);
        expect(logOutput).to.have.string(dummyCommitMessage);
        done();
      });
    });

  });

  it('should respect original behavior of -a option', function (done) {

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
        dummyfilecopy: {
          contents: `duck-duck-goose`,
          filename: `mydummyfilecopy.txt`,
          add: false,
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
      args: ['-a']
    };

    // Quick setup the repos, adapter, and grab a simple prompter
    let prompter = quickPrompterSetup(sh, repoConfig, adapterConfig, dummyCommitMessage, options);
    // TEST

    // Pass in inquirer but it never gets used since we've mocked out a different
    // version of prompter.
    commitizenCommit(sh, inquirer, repoConfig.path, prompter, { disableAppendPaths: true, quiet: true, emitData: true }, function () {
      log(repoConfig.path, function (logOutput) {
        expect(logOutput).to.have.string(dummyCommitMessage);
      });
      whatChanged(repoConfig.path, function (whatChangedOutput) {
        expect(whatChangedOutput).to.have.string('A\t' + repoConfig.files.dummyfile.filename);
        expect(whatChangedOutput).to.not.have.string('A\t' + repoConfig.files.dummyfilecopy.filename);
        done();
      });
    });

  });

});

afterEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // All this should do is archive the tmp path to the artifacts
  clean.afterEach(sh, config.paths.tmp, config.preserve);
});

after(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // Once everything is done, the artifacts should be cleaned up based on
  // the preserve setting in the config
  clean.after(sh, config.paths.tmp, config.preserve);
});

/**
  * This is just a helper for testing. NOTE that prompter
  * prompter is overriden for testing purposes.
  */
function quickPrompterSetup (sh, repoConfig, adapterConfig, commitMessage, options = {}) {

  commitizenInit(sh, repoConfig.path, adapterConfig.npmName);

  // NOTE:
  // In our real code we'd use this here but since we're testing,
  // we'll provide prompter. We'd normally use:
  //   let prompter = getPrompter(adapterConfig.path);
  let prompter = function (cz, commit) {
    commit(commitMessage, options);
  }

  gitInit(sh, repoConfig.path);

  writeFilesToPath(repoConfig.files, repoConfig.path);

  for (let key in repoConfig.files) {
    let file = repoConfig.files[key];
    if (file.add !== false) {
      gitAddFile(sh, repoConfig.path, file.filename);
    }
  }

  // NOTE: In the real world we would not be returning
  // this we would instead be just making the commented
  // out getPrompter() call to get user input (above).
  return prompter;
}

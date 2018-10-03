/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

// Bootstrap our tester
import { bootstrap } from '../tester';

// Get our source files
import { init as gitInit, addPath as gitAdd } from '../../src/git';
import { staging } from '../../src/commitizen';

// Destructure some things for cleaner tests
let { config, sh, repo, clean, files } = bootstrap();
let { writeFilesToPath } = files;

before(function () {
  // Creates the temp path
  clean.before(sh, config.paths.tmp);
});

beforeEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(sh, config.paths.endUserRepo);
});

describe('staging', function () {

  it('should determine if a repo is clean', function (done) {

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

    staging.isClean('./@this-actually-does-not-exist', function (stagingError) {
      expect(stagingError).to.be.an.instanceof(Error);

      staging.isClean(repoConfig.path, function (stagingIsCleanError, stagingIsClean) {
        expect(stagingIsCleanError).to.be.null;
        expect(stagingIsClean).to.be.true;

        writeFilesToPath(repoConfig.files, repoConfig.path);

        gitAdd(sh, repoConfig.path);

        staging.isClean(repoConfig.path, function (afterWriteStagingIsCleanError, afterWriteStagingIsClean) {
          expect(afterWriteStagingIsCleanError).to.be.null;
          expect(afterWriteStagingIsClean).to.be.false;

          writeFilesToPath({
            dummymodified: {
              contents: repoConfig.files.dummyfile.contents + '-modified',
              filename: repoConfig.files.dummyfile.filename,
            }
          }, repoConfig.path);

          staging.isClean(repoConfig.path, function (afterWriteStagingIsCleanError, afterWriteStagingIsClean) {
            expect(afterWriteStagingIsCleanError).to.be.null;
            expect(afterWriteStagingIsClean).to.be.false;
            done();
          });
        });
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

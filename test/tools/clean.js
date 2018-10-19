import * as path from 'path';
import fs from 'fs-extra';
import uuid from 'node-uuid';

export {
  before,
  after,
  afterEach
};

// Unique id for each 'run' of the entire test suite
let testSuiteRunId = uuid.v4();

// At the beginning of a run purge .tmp
function before (sh, tmpPath) {
  cleanPath(sh, tmpPath);
  // clean(sh, tmpPath, 'all');
}

function afterEach (sh, tmpPath, preserve) {
  if (preserve !== false) {
    archive(sh, tmpPath, testSuiteRunId);
  }
  cleanPath(sh, tmpPath);
}

// After should listen to the user via the config
// Before should always purge .tmp irregardless of config
function after (sh, tmpPath, preserve) {
  clean(sh, tmpPath, preserve);
}

/**
 * Copies the .tmp folder to the artifacts folder,
 * then clears the .tmp folder
 *
 * Generally should be run in afterEach()
 */
function archive (sh, tmpPath, testSuiteRunId) {
  let destinationPath = path.resolve(tmpPath + '/../artifacts/' + testSuiteRunId + '/' + uuid.v4());
  sh.mkdir('-p', destinationPath);
  sh.cp('-Rf', tmpPath + '/*', destinationPath);
}

/**
 * Cleans up the artifacts folder
 *
 * Generally called in after()
 */
function clean (sh, tmpPath, preserve) {

  /**
   * If preserve is a normal integer over 0 thats how many results to keep.
   * If string 'all' then keep all
   * Else: don't preserve anything
   */
  if (preserve === 'all') {

    /**
     * Preserve all artifacts
     * Don't purge any artifacts
     *
     * BEWARE: this can fill the disk up over time
     */
    return;

  } else if (isNormalNonZeroInteger(preserve)) {

    /**
     * Preserve a specific number of artifacts
     *
     * 1 = keep only th last run
     * 2 = keep the last run and the one before it, purging any that happened beforehand
     */

    // Set the path
    let artifactsBasePath = path.resolve(tmpPath + '/../artifacts');

    // The the files in this path
    let artifactFolders = fs.readdirSync(artifactsBasePath);

    // Reverse chronologially sort the files
    artifactFolders.sort(function (a, b) {
      return fs.statSync(path.resolve(artifactsBasePath, b)).mtime.getTime() - fs.statSync(path.resolve(artifactsBasePath, a)).mtime.getTime();
    });

    // Keep only the number of files defined in the config setting 'preserve'.
    keep(sh, artifactsBasePath, artifactFolders, preserve);
  }

  // Always purge tmp, it needs to be empty for next run
  cleanPath(sh, tmpPath);
}

function isNormalNonZeroInteger (str) {

  if (Number.isInteger(str) && str > 0) { // Check for integers above 0
    return str;
  } else { // Check for strings that cast to ints that are above 0
    var n = ~~Number(str);
    return String(n) === str && n > 0;
  }
}

/**
 * Given a reverse chronological array of paths
 * This deletes all files except for n of them
 *
 * n is the (1 indexed) count of files to keep.
 */
function keep (sh, basePath, paths, n) {

  for (let i = paths.length; i > n; i--) {
    fs.removeSync(path.resolve(basePath, paths[i - 1]));
  }
}

function cleanPath (sh, tmpPath) {
  sh.rm('-rf', tmpPath + '/*');
  sh.mkdir(tmpPath);
}

export {
  addPath,
  addFile
}

/**
 * Synchronously adds a path to git staging
 */
function addPath (sh, repoPath) {
  sh.cd(repoPath);
  sh.exec('git add .');
}

/**
 * Synchronously adds a file to git staging
 */
function addFile (sh, repoPath, filename) {
  sh.cd(repoPath);
  sh.exec('git add ' + filename)
}

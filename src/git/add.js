import childProcess from 'child_process';

export {
  addPath,
  addFile
}

/**
 * Synchronously adds a path to git staging
 */
function addPath (repoPath) {
  childProcess.spawnSync('git', ['add', '.'], { cwd: repoPath });
}

/**
 * Synchronously adds a file to git staging
 */
function addFile (repoPath, filename) {
  childProcess.spawnSync('git', ['add', filename], { cwd: repoPath });
}

import childProcess from 'child_process';

export { init };

/**
 * Synchronously creates a new git repo at a path
 */
function init (repoPath) {
  childProcess.spawnSync('git', ['init'], { cwd: repoPath });
}

import execa from 'execa';

export { init };

/**
 * Synchronously creates a new git repo at a path
 */
function init (repoPath) {
  execa.sync('git', ['init'], { cwd: repoPath });
}

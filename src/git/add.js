import execa from 'execa';

export { addPath };

/**
 * Synchronously adds a path to git staging
 */
function addPath (repoPath) {
  execa.sync('git', ['add', '.'], { cwd: repoPath });
}

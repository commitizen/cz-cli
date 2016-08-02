export { init };

/**
 * Synchronously creates a new git repo at a path
 */
function init(sh, repoPath) {
  sh.cd(repoPath);
  sh.exec('git init');
}

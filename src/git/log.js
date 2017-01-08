import execa from 'execa';

export { log };

/**
 * Asynchronously gets the git log output
 */
function log (repoPath) {
  const opts = { maxBuffer: Infinity, cwd: repoPath };

  return execa.stdout('git', ['log'], opts);
}

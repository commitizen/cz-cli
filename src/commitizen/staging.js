import { exec } from 'child_process';

export { isClean };

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean (repoPath, done) {
  exec('git diff --no-ext-diff --name-only && git diff --no-ext-diff --cached --name-only', {
    maxBuffer: Infinity,
    cwd: repoPath || process.cwd()
  }, function (error, stdout) {
    if (error) {
      return done(error);
    }
    let output = stdout || '';
    done(null, output.trim().length === 0);
  });
}

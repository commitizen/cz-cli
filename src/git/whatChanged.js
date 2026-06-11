import { exec } from 'child_process';

export { whatChanged };

/**
 * Asynchronously gets the git log raw output (formerly `git whatchanged`,
 * which modern git refuses to run without `--i-still-use-this`).
 */
function whatChanged (repoPath, done) {
  exec('git log --raw --no-merges', {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    done(stdout);
  });
}

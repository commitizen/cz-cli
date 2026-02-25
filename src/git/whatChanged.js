import { exec } from 'child_process';

export { whatChanged };

/**
 * Asynchronously gets the git whatchanged output
 */
function whatChanged (repoPath, done) {
  exec('git whatchanged --i-still-use-this', {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    done(stdout);
  });
}

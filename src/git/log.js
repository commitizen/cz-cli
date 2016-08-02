import {exec} from 'child_process';

export { log };

/**
 * Asynchronously gets the git log output
 */
function log(repoPath, done) {
  exec('git log', {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function(error, stdout, stderr) {
    if (error) {
      done();
    }
    done(stdout);
  });
}

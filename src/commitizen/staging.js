import { exec } from 'child_process';

export { isClean };

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean (repoPath, done, stageAllFiles) {
  exec(`git diff --cached --no-ext-diff --name-only ${!!stageAllFiles ? '&& git diff --no-ext-diff --name-only' : ''}`, {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function (error, stdout) {
    if (error) {
      return done(error);
    }
    let output = stdout || '';
    done(null, output.trim().length === 0);
  });
}

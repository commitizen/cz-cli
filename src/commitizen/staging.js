import { exec } from 'child_process';

export { isClean };

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean (repoPath, commitAll, done) {
  const cmd = commitAll ? 'git diff --name-only' : 'git diff --cached --name-only';
  exec(cmd, {
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

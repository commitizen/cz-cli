import git from 'gulp-git';

export { log };

/**
 * Asynchronously gets the git log output
 */
function log(repoPath, done) {
  // Get a gulp stream based off the config
  git.exec({cwd: repoPath, args: 'log', quiet: true}, function(err, stdout) {
    done(stdout);
  });
}
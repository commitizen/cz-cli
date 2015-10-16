import git from 'gulp-git';
import gulp from 'gulp';
import dedent from 'dedent';

export { commit };

/**
 * Asynchronously git commit at a given path with a message
 */
function commit(sh, repoPath, message, options, done) {

  // Get a gulp stream based off the config
  gulp.src(repoPath)

    // Format then commit
    .pipe(git.commit(dedent(message), options))
  
    // Handle commit success
    .on('end', function() {
      done();
    })
    
    // Handle commit failure
    .on('error', function (error) {
      console.error(error);
      done(error);
    });

}
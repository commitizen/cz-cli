import os from 'os';
import git from 'gulp-git';
import gulp from 'gulp';
import dedent from 'dedent';
import {isString} from '../common/util';

export { commit };

/**
 * Asynchronously git commit at a given path with a message
 */
function commit(sh, repoPath, message, options, done) {

  var alreadyEnded = false;
  let dedentedMessage = dedent(message);
  let escapedMessage = dedentedMessage.replace(/"/g, '\\"');
  let operatingSystemNormalizedMessage;

  if(os.platform()=="win32") {
    operatingSystemNormalizedMessage = escapedMessage.replace(/\r/g, '');
  } else {
    operatingSystemNormalizedMessage = escapedMessage.replace(/`/g, '\\`');
  }
  
  // Get a gulp stream based off the config
  gulp.src(repoPath)

    // Format then commit
    .pipe(git.commit(operatingSystemNormalizedMessage, options))
    
    // Write progress to the screen
    .on('data',function(data) {
      
      // Ignore this for code coverage since it is only there 
      // to make our testing suite pretty
      /* istanbul ignore if  */
      if(!options.quiet) {
        if(isString(data))
        {
         process.stdout.write(data); 
        } 
      }
    })
    
    // Handle commit success
    .on('end', function() {
      // TODO: Bug? Done is fired twice :(
      if(!alreadyEnded)
      {
        done();
        alreadyEnded=true; 
      }
    })
    
    // Handle commit failure
    .on('error', function (err) {
      console.error(err);
      done(err);
    });

}
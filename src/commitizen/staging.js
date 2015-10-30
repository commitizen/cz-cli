import git from 'gulp-git';
import {isString} from '../common/util';

export {isClean};

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean(repoPath, done) {
  git.exec({cwd:repoPath, args: '--no-pager diff --cached --name-only', quiet: true}, function (err, stdout) {
    let stagingIsClean;
    if(stdout && isString(stdout) && stdout.trim().length>0)
    {
      stagingIsClean = false;
    } else {
      stagingIsClean = true;
    }
    done(stagingIsClean);
  });
}

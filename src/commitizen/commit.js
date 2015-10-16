import dedent from 'dedent';
import {commit as gitCommit, log} from '../git';

export default commit;
 
 /**
  * Asynchronously commits files using commitizen
  */
function commit(sh, inquirer, repoPath, prompter, options, done) {
  
  // Get user input -- side effect that is hard to test
  prompter(inquirer, function(template) {
    
    // Commit the user input -- side effect that we'll test
    gitCommit(sh, repoPath, template, options, function() {
      done(template);
    });
  });
   
}
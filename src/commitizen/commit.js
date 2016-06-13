import path from 'path';
import configDir from 'application-config-path';
import dedent from 'dedent';
import {commit as gitCommit, log} from '../git';
import * as cache from './cache';
import createIfNotExists from '../common/util';

export default commit;

/**
 * Takes all of the final inputs needed in order to make dispatch a git commit
 */
function dispatchGitCommit(sh, repoPath, template, options, overrideOptions, done) {
  
    // Commit the user input -- side effect that we'll test
    gitCommit(sh, repoPath, template, { ...options, ...overrideOptions }, function() {
      done(template);
    });
    
}

 /**
  * Asynchronously commits files using commitizen
  */
function commit(sh, inquirer, repoPath, prompter, options, done) {
  
  var cachePath = path.join(configDir('commitizen'), 'commitizen.json');
  
  createIfNotExists(cachePath, function() {
    if (error) {
      console.error("Couldn't create commitizen cache directory: ", error); // TODO properly handle error?
    } else {
      if(options.retryLastCommit) {
      
      console.log('Retrying last commit attempt.');
      
      // We want to use the last commit instead of the current commit,
      // so lets override some options using the values from cache.
      let { 
        options: retryOptions,
        overrideOptions: retryOverrideOptions,
        template: retryTemplate
      } = cache.getCacheValueSync(cachePath, repoPath);
      dispatchGitCommit(sh, repoPath, retryTemplate, retryOptions, retryOverrideOptions, done);
      
      } else {
        // Get user input -- side effect that is hard to test
        prompter(inquirer, function(template, overrideOptions) {
        
          // We don't want to add retries to the cache, only actual commands
          cache.setCacheValueSync(cachePath, repoPath, { template, options, overrideOptions });
          dispatchGitCommit(sh, repoPath, template, options, overrideOptions, done);
        }); 
      }
    }
  });
   
}

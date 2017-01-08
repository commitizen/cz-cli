import path from 'path';

import pify from 'pify';
import dedent from 'dedent';
import cacheDir from 'cachedir';
import {ensureDir} from 'fs-extra';
import {commit as gitCommit, log} from '../git';
import * as cache from './cache';

export default commit;

function askUser (inquirer, prompter) {
  return new Promise(function (resolve, reject) {
    prompter(inquirer, function (arg0, arg1) {
      // Allow adapters to error out by providing an Error
      if (arg0 instanceof Error) {
        return reject(arg0);
      }

      resolve({ template: arg0, overrideOptions: arg1 });
    });
  });
}

 /**
  * Asynchronously commits files using commitizen
  */
function commit (inquirer, repoPath, prompter, options) {
  var cacheDirectory = cacheDir('commitizen');
  var cachePath = path.join(cacheDirectory, 'commitizen.json');

  return pify(ensureDir)(cacheDirectory).then(function () {
    if (options.retryLastCommit) {
      console.log('Retrying last commit attempt.');

      // We want to use the last commit instead of the current commit,
      // so lets override some options using the values from cache.
      let {
        options: retryOptions,
        overrideOptions: retryOverrideOptions,
        template: retryTemplate
      } = cache.getCacheValueSync(cachePath, repoPath);

      return gitCommit(repoPath, retryTemplate, { ...retryOptions, ...retryOverrideOptions });
    }

    // Get user input -- side effect that is hard to test
    return askUser(inquirer, prompter).then(function ({ template, overrideOptions }) {
      // We don't want to add retries to the cache, only actual commands
      cache.setCacheValueSync(cachePath, repoPath, { template, options, overrideOptions });

      return gitCommit(repoPath, template, { ...options, ...overrideOptions });
    });
  });
}

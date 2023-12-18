import path from 'path';

import { isInTest } from '../common/util.js';
import { defaultConfigExplorer } from "./cosmiconfigLoader";

export { loadConfig, loadConfigAtRoot };

/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications:
 * https://github.com/jscs-dev/node-jscs/blob/master/lib/cli-config.js
 */

/**
 * Get content of the configuration file
 * @param {String} [config] - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {{config: any; filepath: string; isEmpty?: boolean}|undefined}
 */
function loadConfig (config, cwd = process.cwd()) {
  var directory = cwd || process.cwd();

  if (config) {
    const configPath = path.resolve(directory, config);
    const content = defaultConfigExplorer().load(configPath);
    if (content) {
      return content
    }
  }

  const cfg = defaultConfigExplorer().search(directory);
  if (cfg) {
    return cfg;
  }
  /* istanbul ignore if */
  if (!isInTest()) { /* istanbul ignore next */
    // Try to load standard configs from home dir
    const directoryArr = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];
    for (let i = 0, dirLen = directoryArr.length; i < dirLen; i++) {
      if (!directoryArr[i]) {
        continue;
      }

      const content = defaultConfigExplorer({ stopDir: directoryArr[i] }).search(directoryArr[i]);
      if (content) {
        return content;
      }
    }
  }
}

/**
 * Get content of the configuration file
 * @param {String} [config] - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {{config: any; filepath: string; isEmpty?: boolean}|undefined}
 */
function loadConfigAtRoot (config, cwd) {
  const directory = cwd || process.cwd();

  if (config) {
    const configPath = path.resolve(directory, config);
    const cfg = defaultConfigExplorer({ stopDir: directory }).load(configPath);
    if (cfg) {
      return cfg
    }
  }

  const cfg = defaultConfigExplorer({ stopDir: directory }).search(directory);
  if (cfg) {
    return cfg;
  }
}

import { isInTest } from '../common/util.js';
import getConfigContent from "./getContent";
import findConfigContent from "./findContent";

export default loader;

/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications:
 * https://github.com/jscs-dev/node-jscs/blob/master/lib/cli-config.js
 */

/**
 * Get content of the configuration file
 * @param {string} [config] - partial path to configuration file
 * @param {string} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
function loader(config, cwd = process.cwd()) {
  // If config option is given, attempt to load it
  if (config) {
    return getConfigContent(config, cwd);
  }

  const content = findConfigContent(cwd)

  if (content) {
    return content;
  }

  /* istanbul ignore if */
  if (!isInTest()) {
    // Try to load standard configs from home dir
    const directoryArr = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];
    for (let i = 0; i < directoryArr.length; i++) {
      const currentDirectory = directoryArr[i];

      if (!currentDirectory) {
        continue;
      }

      const backupContent = findConfigContent(currentDirectory);
      if (backupContent) {
        return backupContent;
      }
    }
  }

  return undefined;
}

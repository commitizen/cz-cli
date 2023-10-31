import path from 'path';

import { defaultConfigExplorer, deprecatedConfigExplorerFallback } from "./cosmiconfigLoader";
import { isInTest } from "../common/util";

export default getConfigContent;

/**
 * Get content of the configuration file
 * @param {String} [configPath] - partial path to configuration file
 * @param {String} [baseDirectory] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
function getConfigContent (configPath, baseDirectory) {
  if (!configPath) {
    return;
  }

  const resolvedPath = path.resolve(baseDirectory, configPath);

  const maybeConfig = defaultConfigExplorer.load(resolvedPath);
  if (maybeConfig) {
    return maybeConfig.config
  } else {
    const deprecatedConfig = loadOldCzConfig(resolvedPath);
    if (deprecatedConfig) {
      return deprecatedConfig
    }
  }

  return undefined;
}

/**
 * load old czConfig from known place
 *
 * @deprecated
 * @param {string} [fullPath]
 * @return {Object|undefined}
 */
function loadOldCzConfig(fullPath) {
  const maybeDeprecatedConfig = deprecatedConfigExplorerFallback.load(fullPath);
  if (maybeDeprecatedConfig) {
    showOldCzConfigDeprecationWarning();
    return maybeDeprecatedConfig.config;
  }

  return undefined;
}

/**
 * @deprecated
 * @return void
 */
function showOldCzConfigDeprecationWarning() {
  // Suppress during test
  if (!isInTest()) {
    console.error("\n********\nWARNING: This repository's package.json is using czConfig. czConfig will be deprecated in Commitizen 3. \nPlease use this instead:\n{\n  \"config\": {\n    \"commitizen\": {\n      \"path\": \"./path/to/adapter\"\n    }\n  }\n}\nFor more information, see: http://commitizen.github.io/cz-cli/\n********\n");
  }
}

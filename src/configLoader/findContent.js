import { defaultConfigExplorer, deprecatedConfigExplorerFallback } from "./cosmiconfigLoader";
import { isInTest } from "../common/util";

export default findConfigContent;
/**
 * Find content of the configuration file
 * @param {String} cwd - partial path to configuration file
 * @return {Object|undefined}
 */
function findConfigContent(cwd) {
  const maybeConfig = defaultConfigExplorer.search(cwd);
  if (maybeConfig) {
    return maybeConfig.config
  } else {
    const deprecatedConfig = findOldCzConfig(cwd);
    if (deprecatedConfig) {
      return deprecatedConfig
    }
  }

  return undefined;
}

/**
 * find old czConfig
 *
 * @deprecated
 * @param {string} [searchFrom]
 * @return {Object|undefined}
 */
function findOldCzConfig(searchFrom) {
  const maybeDeprecatedConfig = deprecatedConfigExplorerFallback.search(searchFrom);
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

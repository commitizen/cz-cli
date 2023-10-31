import { loader } from '../configLoader';

export { load };

/**
 * Get content of the configuration file
 * @param {string} [config] - partial path to configuration file
 * @param {string} [cwd] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
function load (config, cwd) {
  return loader(config, cwd);
}

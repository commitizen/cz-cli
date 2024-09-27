import { loadConfig, loadConfigAtRoot } from '../configLoader/loader';

export { load, loadAtRoot };


/**
 * @param {String} [config] - partial path to configuration file
 * @param {String} [cwd] - directory path which will be joined with config argument
 * @return {any|undefined} - parsed config or nothing
 */
function load (config, cwd) {
  const cfg = loadConfig(config, cwd);

  if (cfg) {
    return cfg.config;
  } else return undefined;

}

/**
 * @param {String} [config] - partial path to configuration file
 * @param {String} [cwd] - directory path which will be joined with config argument
 * @return {any|undefined} - parsed config or nothing
 */
function loadAtRoot (config, cwd) {
  const cfg = loadConfigAtRoot(config, cwd);

  if (cfg) {
    return cfg.config;
  } else return undefined;

}

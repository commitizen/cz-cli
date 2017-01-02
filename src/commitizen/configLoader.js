import {loader} from '../configLoader';

export { load };

// Configuration sources in priority order.
var configs = ['package.json', '.czrc', '.cz.json'];

function load(config, cwd) {
  return loader(configs, config, cwd);
}

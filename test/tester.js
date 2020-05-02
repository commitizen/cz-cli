import * as repo from './tools/repo';
import * as clean from './tools/clean';
import * as files from './tools/files';
import * as util from '../src/common/util';
import { config as userConfig } from './config';
import _ from 'lodash';

// Clone the user's config so we don't get caught w/our pants down
let patchedConfig = _.cloneDeep(userConfig);

function bootstrap () {

  // Return the patched config
  return {
    config: patchedConfig,
    repo,
    clean,
    util,
    files
  }
}

export {
  bootstrap
};

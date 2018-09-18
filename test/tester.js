import * as repo from './tools/repo';
import * as clean from './tools/clean';
import * as files from './tools/files';
import * as util from '../src/common/util';
import { config as userConfig } from './config';
import * as sh from 'shelljs'; // local instance
import _ from 'lodash';

// Clone the user's config so we don't get caught w/our pants down
let patchedConfig = _.cloneDeep(userConfig);

function bootstrap () {

  // Patch any shelljs specific config settings
  sh.config.silent = patchedConfig.silent || true;

  // Return the patched config and shelljs instance
  return {
    config: patchedConfig,
    sh,
    repo,
    clean,
    util,
    files
  }
}

export {
  bootstrap
};

/* istanbul ignore file */
import { addPath, addFile } from './git/add';
import { commit } from './git/commit';
import { init } from './git/init';
import { log } from './git/log';
import { whatChanged } from './git/whatChanged';

export {
  addPath,
  addFile,
  commit,
  init,
  log,
  whatChanged
};

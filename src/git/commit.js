import os from 'os';
import {spawn} from 'child_process';

import execa from 'execa';
import dedent from 'dedent';
import {isString} from '../common/util';

export { commit };

/**
 * Asynchronously git commit at a given path with a message
 */
function commit (repoPath, message, options) {
  const args = ['commit', '-m', dedent(message), ...(options.args || [])];
  const opts = { cwd: repoPath, stdio: options.quiet ? 'ignore' : 'inherit' };

  return execa('git', args, opts);
}

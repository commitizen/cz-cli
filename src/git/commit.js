import os from 'os';
import {spawn} from 'child_process';

import dedent from 'dedent';
import {isString} from '../common/util';

export { commit };

/**
 * Asynchronously git commit at a given path with a message
 */
function commit (sh, repoPath, message, options, done) {
  let called = false;
  let args = ['commit', '-m', dedent(message), ...(options.args || [])];
  let child = spawn('git', args, {
    cwd: repoPath,
    stdio: options.quiet ? 'ignore' : 'inherit'
  });

  child.on('error', function (err) {
    if (called) return;
    called = true;

    done(err);
  });

  child.on('exit', function (code, signal) {
    if (called) return;
    called = true;

    if (code) {
      done(Object.assign(new Error(`git exited with error code ${code}`), { code, signal }));
    } else {
      done(null);
    }
  });
}

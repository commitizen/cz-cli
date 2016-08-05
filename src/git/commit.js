import os from 'os';
import {exec} from 'child_process';

import dedent from 'dedent';
import {isString} from '../common/util';

export { commit };

function normalizeCommitMessage(message) {
  const signs = os.platform() === 'win32' ?
    /(")/g :
    /(["|`])/g;

  return dedent(message)
    .replace(signs, '\\$1')
    .split(/\r?\n/)
    .map(line => `-m "${line}"`)
    .join(' ');
}

/**
 * Asynchronously git commit at a given path with a message
 */
function commit(sh, repoPath, message, options, done) {
  let args = options.args || '';
  let commitMessage = normalizeCommitMessage(message);

  exec(`git commit ${commitMessage} ${args}`, {
    maxBuffer: Infinity,
    cwd: repoPath,
    stdio: options.quiet ? 'ignore' : 'inherit'
  }, function(error, stdout, stderror) {
    if (error) {
      error.message = [error.message, stderror].filter(Boolean).join('\n');
      return done(error);
    }
    done();
  });
}

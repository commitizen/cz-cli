import childProcess from 'child_process';
import fs from 'fs';

export {
  createEmpty,
  createEndUser
};

/**
 * Create an empty repo
 */
function createEmpty (path) {
  fs.mkdirSync(path, { recursive: true });
  childProcess.spawnSync('npm', ['init', '--force', '--yes'], { cwd: path, shell: true });
}

/**
 * Create a new repo to hold an end user app
 */
function createEndUser (path) {
  createEmpty(path);
}

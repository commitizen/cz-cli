import { execSync, spawn } from 'child_process';

import path from 'path';

import { writeFileSync, openSync, closeSync } from 'fs';

import dedent from 'dedent';

export { commit };

/**
 * Asynchronously git commit at a given path with a message
 */
function commit (repoPath, message, options, done) {
  let called = false;

  // commit the file by spawning a git process, unless the --hook
  // option was provided. in that case, write the commit message into
  // the .git/COMMIT_EDITMSG file
  if (!options.hookMode) {
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
        if (code === 128) {
          console.warn(`
            Git exited with code 128. Did you forget to run:

              git config --global user.email "you@example.com"
              git config --global user.name "Your Name"
            `)
        }
        done(Object.assign(new Error(`git exited with error code ${code}`), { code, signal }));
      } else {
        done(null);
      }
    });
  } else {
    const gitDirPath = execSync(
      'git rev-parse --absolute-git-dir',
      { cwd: repoPath, encoding: 'utf8' },
    ).trim();
    const commitFilePath = path.join(gitDirPath, 'COMMIT_EDITMSG');
    try {
      const fd = openSync(commitFilePath, 'w');
      try {
        writeFileSync(fd, dedent(message));
        done(null);
      } catch (e) {
        done(e);
      } finally {
        closeSync(fd);
      }
    } catch (e) {
      // windows doesn't allow opening existing hidden files
      // in 'w' mode... but it does let you do 'r+'!
      try {
        const fd = openSync(commitFilePath, 'r+');
        try {
          writeFileSync(fd, dedent(message));
          done(null);
        } catch (e) {
          done(e);
        } finally {
          closeSync(fd);
        }
      } catch (e) {
        done(e);
      }
    }
  }
}

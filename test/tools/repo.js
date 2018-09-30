export {
  createEmpty,
  createEndUser
};

/**
 * Create an empty repo
 */
function createEmpty (sh, path) {
  sh.mkdir(path);
  sh.cd(path);
  sh.exec('npm init --force --yes');
}

/**
 * Create a new repo to hold an end user app
 */
function createEndUser (sh, path) {
  createEmpty(sh, path);
}

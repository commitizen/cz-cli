import child_process from 'child_process';

export default git;

// We don't have a config, so either we use raw args to try to commit
// or if debug is enabled then we do a strict check for a config file.
function git(rawGitArgs, environment) {
  if(environment.debug === true) {
    console.error('COMMITIZEN DEBUG: No git-cz friendly config was detected. I looked for .czrc, .cz.json, or czConfig in package.json.');
  } else {
    var vanillaGitArgs = ["commit"].concat(rawGitArgs);

    var child = child_process.spawn('git', vanillaGitArgs, {
      stdio: 'inherit'
    });

    child.on('error', function (e, code) {
      console.error(e);
      throw e;
    });
  }
}

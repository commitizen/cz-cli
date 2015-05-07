var System = require('systemjs');
var fs = require('fs');
var dedent = require('dedent');
var inquirer = require('inquirer');
var gulp = require('gulp');
var git = require('gulp-git');
var minimist = require('minimist');
var child_process = require('child_process');

exports.init = function(rawGitArgs, environment, config) {
  if(typeof environment === 'undefined') {
    environment = {};
  }

  if(typeof config !== 'undefined') {
    withConfig(rawGitArgs, environment, config);
  } else {
    withoutConfig(rawGitArgs, environment);
  }
}

function withConfig(rawGitArgs, environment, config) {
  
  System.baseURL = config.path;

  // TODO Store the stripped out m's for use later
  strippedGitArgs = stripGitArgsMessages(rawGitArgs);

  // Load the config
  fs.open(config.path, 'r', function() {

    // Load the module based on the config
    System.import('index').then(function(m) {

      // Call the prompter method on the module, get the template
      m.prompter(inquirer, function(template) {

        // Get a gulp stream based off the config
        gulp.src(config.path)

        // Format then commit
        .pipe(git.commit(dedent(template), {args: strippedGitArgs, disableAppendPaths: true}))

        // Handle commit success
        .on('end', function() {
          console.log('✓ Commit succeeded.');
        })

        // Handle commit failure
        .on('error', function (error) {
          console.error('✗ Commit failed. Did you forget to \'git add\' your files?');
        });
      });
    });
  });
}

// We don't have a config, so either we use raw args to try to commit
// or if debug is enabled then we do a strict check for a config file.
function withoutConfig(rawGitArgs, environment) {
  if(environment.debug === true) {
    console.error('COMMITIZEN DEBUG: No git-cz friendly config was detected. I looked for .czrc, .cz.json, or czConfig in package.json.');
  } else {
    var vanillaGitArgs = ["commit"].concat(rawGitArgs);

    var child = child_process.spawn('git', vanillaGitArgs, {
      stdio: 'inherit'
    });

    child.on('error', function (e, code) {
      console.error(e);
    });
  }
}

// Aww shit it is ugly
function stripGitArgsMessages(rawGitArgs) {

  var args = minimist(rawGitArgs, { 
    alias: {
      m: 'message'
    }
  });

  // Loop through all keys
  var output = ' ';

  for (arg in args) {

    if (!args.hasOwnProperty(arg)) {
      //The current property is not a direct property
      continue;
    }

    var key = arg;
    var value = args[arg];
    
    /**
     * Ugly, but this is recompiles an argument string without 
     * any messages passed in.
     */
    if (key === '_' && value.length > 0) {
      // Anything in the _ array of strings is a one off file
      output += value.join(' ') + ' ';
    } else if (key === 'message') {
      /**
       * We strip out message because we're already handling this
       * in minimist's aliases.
       */
      continue;
    } else if (typeof value === String) {
      output += '-' + key + ' ' + value + ' ';
    } else if (typeof value === Array) {
      output += '-' + key + ' ' + value.join(' -' + key) + ' ';
    } else if (value === true || value === false) {
      output += '-' + key + ' ';
    } else {
      /**
       * Based on the current minimist object structure, we should
       * never get here, but we'll protect against breaking changes.
       */
      continue;
    }
  }

  if(output.trim().length < 1) {
    return '';
  } else {
    return output;
  }
}

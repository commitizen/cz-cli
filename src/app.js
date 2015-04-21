var configLoader = require('./configLoader.js');
var cz = require('./cz.js');

exports.bootstrap = function(environment) {

  // Pass through any additional arguments that would normally
  // go to git.
  var gitArgs = process.argv.slice(2, process.argv.length);

  // Get the config from the filesystem
  var config = configLoader.load();

  // Initialize the commit process
  cz.init(gitArgs, environment, config);

}
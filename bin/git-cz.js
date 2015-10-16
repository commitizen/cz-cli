require("babel/register");
var path = require('path');
require('../src/cli/git-cz.js').bootstrap({
  cliPath: path.join(__dirname, '../')
});
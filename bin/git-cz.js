var path = require('path');
require('../dist/cli/git-cz.js').bootstrap({
  cliPath: path.join(__dirname, '../')
});

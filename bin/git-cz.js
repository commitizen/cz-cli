var path = require('path');

process.on('uncaughtException', function (err) {
  console.error(err.message || err);
  process.exit(1);
});

// catch SIGINT signal
process.stdin.on('data', function (key) {
  if (key == '\u0003') {
    process.exit(130); // 128 + SIGINT
  }
});

require('../dist/cli/git-cz.js').bootstrap({
  cliPath: path.join(__dirname, '../')
});

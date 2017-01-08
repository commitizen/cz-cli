var axios = require('axios');

var requiredEnvironmentVariables = [
  'AV_ACCOUNTNAME',
  'AV_PROJECTSLUG',
  'AV_TOKEN'
];

for (var e = 0; e < requiredEnvironmentVariables.length; e++)
{
  console.log('checking', requiredEnvironmentVariables[e]);
  ensureEnvironmentVariableIsSet(requiredEnvironmentVariables[e]);
}

axios({
  method: 'post',
  url: 'https://ci.appveyor.com/api/builds',
  headers: {
    'Content-type': 'application/json',
    'Authorization': 'Bearer ' + process.env.AV_TOKEN
  },
  data: {
    accountName: process.env.AV_ACCOUNTNAME,
    projectSlug: process.env.AV_PROJECTSLUG,
    branch: process.env.AV_BRANCH ? process.env.AV_BRANCH : process.env.TRAVIS_BRANCH
  }
})
.then(function (response) {
  if (response.data && response.data.buildId && response.data.buildId > 1)
  {
    console.log('Linux build complete. Windows build starting at: https://ci.appveyor.com/project/' + process.env.AV_ACCOUNTNAME + '/' + process.env.AV_PROJECTSLUG + '/build/' + response.data.version);
  } else {
    console.error(response);
    die();
  }
})
.catch(function (err) {
  console.error(err);
  die();
});

function die () {
  console.error('\nERROR: I could not start the Windows test suite on AppVeyor.\n\nPlease ensure that you\'ve set the following environment variables: AV_ACCOUNTNAME, AV_BRANCH, AV_PROJECTSLUG and the following secure (encrypted) TravisCI environment variables: AV_BEARER. \n\nHint: Are you sure you\'ve regenerated the encrypted / secure environment variabes in the .travis.yml? The ones included by default in that file are the repo maintainers and will not work on your fork of this project.\n');
  process.exit(1);
}

function ensureEnvironmentVariableIsSet (envName) {
  if (!process.env[envName]) 
  {
    console.error('ERROR: The environment variable ' + envName + ' was not set and is required to run windows tests.');
    process.exit(1); 
  }
}

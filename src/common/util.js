import fs from 'fs';
import path from 'path';

export {
  executeShellCommand,
  getParsedJsonFromFile,
  getParsedPackageJsonFromPath,
  isArray,
  isFunction,
  isString,
  isInTest
}

/**
 * Executes the command passed to it at the path requested
 * using the instance of shelljs passed in
 */
function executeShellCommand (sh, path, installCommand) {
  sh.cd(path);
  sh.exec(installCommand);
}

/**
 * Gets the parsed contents of a json file
 */
function getParsedJsonFromFile (filePath, fileName, encoding = 'utf8') {
  try {
    var packageJsonContents = fs.readFileSync(path.join(filePath, fileName), encoding);
    return JSON.parse(packageJsonContents);
  } catch (e) {
    console.error(e);
  }
}

/**
 * A helper method for getting the contents of package.json at a given path
 */
function getParsedPackageJsonFromPath (path) {
  return getParsedJsonFromFile(path, 'package.json');
}

/**
 * Test if the passed argument is an array
 */
function isArray (arr) {
    if (typeof arr === "undefined")
  {
    return false;
  } else if (arr === null) {
    return false;
  } else {
    return arr.constructor === Array;
  }
}

/**
 * Test if the passed argument is a function
 */
function isFunction (functionToCheck) {
  if (typeof functionToCheck === "undefined")
  {
    return false;
  } else if (functionToCheck === null) {
    return false;
  } else {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }
}

/**
 * Test if the passed argument is a string
 */
function isString (str) {
  if (typeof str === "undefined")
  {
    return false;
  } else if (str === null) {
    return false;
  } else {
    return Object.prototype.toString.call(str) === '[object String]';
  }
}

function isInTest () {
  return typeof global.it === 'function';
}

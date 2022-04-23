import fs from 'fs';
import path from 'path';

export {
  getParsedJsonFromFile,
  getParsedPackageJsonFromPath,
  isFunction,
  isInTest
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
    var functionType = getType.toString.call(functionToCheck);
    return functionToCheck && (functionType === '[object Function]' || functionType === '[object AsyncFunction]');
  }
}

function isInTest () {
  return typeof global.it === 'function';
}

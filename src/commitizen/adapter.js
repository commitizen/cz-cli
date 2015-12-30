import path from 'path';
import fs from 'fs';
import findNodeModules from 'find-node-modules';
import _ from 'lodash';
import detectIndent from 'detect-indent';

import {isFunction} from '../common/util';

export {
  addPathToAdapterConfig,
  getNearestNodeModulesDirectory,
  getNearestProjectRootDirectory,
  getNpmInstallStringMappings,
  getPrompter,
  generateNpmInstallAdapterCommand,
  resolveAdapterPath
};

/**
 * ADAPTER
 * 
 * Adapter is generally responsible for actually installing adapters to an 
 * end user's project. It does not perform checks to determine if there is
 * a previous commitizen adapter installed or if the proper fields were
 * provided. It defers that responsibility to init. 
 */

/**
 * Modifies the package.json, sets config.commitizen.path to the path of the adapter
 * Must be passed an absolute path to the cli's root
 */
function addPathToAdapterConfig(sh, cliPath, repoPath, adapterNpmName) {
  
  let commitizenAdapterConfig = {
    config: {
      commitizen: {
        path: `./node_modules/${adapterNpmName}`
      }
    }
  };
  
  let packageJsonPath = path.join(getNearestProjectRootDirectory(), 'package.json');
  let packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
  // tries to detect the indentation and falls back to a default if it can't
  let indent = detectIndent(packageJsonString).indent || '  ';
  let packageJsonContent = JSON.parse(packageJsonString);
  let newPackageJsonContent = '';
  if(_.get(packageJsonContent,'config.commitizen.path') !== adapterNpmName) {
    newPackageJsonContent = _.merge(packageJsonContent, commitizenAdapterConfig);
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJsonContent, null, indent));
}

/**
 * Generates an npm install command given a map of strings and a package name
 */
function generateNpmInstallAdapterCommand(stringMappings, adapterNpmName) {
 
  // Start with an initial npm install command
  let installAdapterCommand = `npm install ${adapterNpmName}`;
  
  // Append the neccesary arguments to it based on user preferences
  for(let [key, value] of stringMappings.entries()) {
    if(value) {
      installAdapterCommand = installAdapterCommand + ' ' + value;
    }
  }
  
  return installAdapterCommand;
}

/**
 * Gets the nearest npm_modules directory
 */
function getNearestNodeModulesDirectory(options) {
  
  // Get the nearest node_modules directories to the current working directory
  let nodeModulesDirectories = findNodeModules(options);
  
   // Make sure we find a node_modules folder
  if(nodeModulesDirectories && nodeModulesDirectories.length > 0) {
    return nodeModulesDirectories[0];
  } else {
    console.error(`Error: Could not locate node_modules in your project's root directory. Did you forget to npm init or npm install?`)
  }
}

/**
 * Gets the nearest project root directory
 */
function getNearestProjectRootDirectory(options) {
  return path.join(process.cwd(), getNearestNodeModulesDirectory(options), '/../');
}

/**
 * Gets a map of arguments where the value is the corresponding npm strings
 */
function getNpmInstallStringMappings(save, saveDev, saveExact, force) {
  return new Map()
    .set('save', (save && !saveDev) ? '--save':undefined)
    .set('saveDev', saveDev ? '--save-dev':undefined)
    .set('saveExact', saveExact ? '--save-exact':undefined)
    .set('force', force ? '--force':undefined);
}

/**
 * Gets the prompter from an adapter given an adapter path
 */
function getPrompter(adapterPath) {
  // We need to handle directories and files, so resolve the parh first
  let resolvedAdapterPath = resolveAdapterPath(adapterPath);

  // Load the adapter
  let adapter = require(resolvedAdapterPath);
  
  if(adapter && adapter.prompter && isFunction(adapter.prompter)) {
     return adapter.prompter; 
  } else {
    throw "Could not find prompter method in the provided adapter module: " + adapterPath;
  }
}

/**
 * Given a path, which can be a directory or file, will
 * return a located adapter path or will throw.
 */
function resolveAdapterPath(inboundAdapterPath) {
  let outboundAdapterPath;
  
  // Try to open the provided path
  try {
    
        // If we're given a directory, check for a package.json, otherwise append index.js
    if (fs.lstatSync(inboundAdapterPath).isDirectory()) {
      let inboundAdapterPackageJsonPath = path.join(inboundAdapterPath, 'package.json');
      if (fs.lstatSync(inboundAdapterPackageJsonPath)) {
        let packageJsonString = fs.readFileSync(inboundAdapterPackageJsonPath, 'utf-8');
        let packageJsonContent = JSON.parse(packageJsonString);
        let inboundAdapterMainJsPath = _.get(packageJsonContent, 'main');
        outboundAdapterPath = path.join(inboundAdapterPath, inboundAdapterMainJsPath);
      } else {
        // Modify the path and make sure the modified path exists
        outboundAdapterPath = path.join(inboundAdapterPath, 'index.js');
        fs.lstatSync(outboundAdapterPath);
      }
      
    } else {
      // The file exists and is a file, so just return it
      outboundAdapterPath = inboundAdapterPath;
    }
    return outboundAdapterPath;
    
  } catch(err) {
    throw err;
  }
  
}

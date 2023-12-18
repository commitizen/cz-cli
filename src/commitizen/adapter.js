import childProcess from 'child_process';
import path from 'path';
import fs from 'fs';
import findNodeModules from 'find-node-modules';
import _ from 'lodash';
import detectIndent from 'detect-indent';

import { isFunction } from '../common/util';

export {
  addPathToAdapterConfig,
  getNearestNodeModulesDirectory,
  getNearestProjectRootDirectory,
  getInstallStringMappings,
  getPrompter,
  generateInstallAdapterCommand,
  resolveAdapterPath,
  getGitRootPath,
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
function addPathToAdapterConfig (cliPath, repoPath, adapterNpmName) {

  let commitizenAdapterConfig = {
    config: {
      commitizen: {
        path: `./node_modules/${adapterNpmName}`
      }
    }
  };

  let packageJsonPath = path.join(getNearestProjectRootDirectory(repoPath), 'package.json');
  let packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
  // tries to detect the indentation and falls back to a default if it can't
  let indent = detectIndent(packageJsonString).indent || '  ';
  let packageJsonContent = JSON.parse(packageJsonString);
  let newPackageJsonContent = '';
  if (_.get(packageJsonContent, 'config.commitizen.path') !== adapterNpmName) {
    newPackageJsonContent = _.merge(packageJsonContent, commitizenAdapterConfig);
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJsonContent, null, indent) + '\n');
}

/*
 * Get additional options for install command
 */
function getInstallOptions(stringMappings) {
  return Array.from(stringMappings.values()).filter(Boolean).join(" ")
}

/*
 * Get specific install command for passed package manager
 */
function getInstallCommand(packageManager) {
  const fallbackCommand = 'install';
  const commandByPackageManager = {
    npm: 'install',
    yarn: 'add',
    pnpm: 'add',
  };

  return commandByPackageManager[packageManager] || fallbackCommand;
}

/**
 * Generates an npm install command given a map of strings and a package name
 */
function generateInstallAdapterCommand(stringMappings, adapterNpmName, packageManager = "npm") {
  return `${packageManager} ${getInstallCommand(packageManager)} ${adapterNpmName} ${getInstallOptions(stringMappings)}`;
}

/**
 * Gets the nearest npm_modules directory
 */
function getNearestNodeModulesDirectory (options) {

  // Get the nearest node_modules directories to the current working directory
  let nodeModulesDirectories = findNodeModules(options);

  // Make sure we find a node_modules folder

  /* istanbul ignore else */
  if (nodeModulesDirectories && nodeModulesDirectories.length > 0) {
    return nodeModulesDirectories[0];
  } else {
    console.error(`Error: Could not locate node_modules in your project's root directory. Did you forget to npm init or npm install?`)
  }
}

/**
 * Gets the nearest project root directory
 */
function getNearestProjectRootDirectory (repoPath, options) {
  return path.join(repoPath, getNearestNodeModulesDirectory(options), '/../');
}

/**
 * Gets a map of arguments where the value is the corresponding (to passed package manager) string
 */
function getInstallStringMappings({ save, dev, saveDev, exact, saveExact, force }, packageManager) {
  const npm = new Map()
    .set('save', save && !saveDev ? '--save' : undefined)
    .set('saveDev', saveDev ? '--save-dev' : undefined)
    .set('saveExact', saveExact ? '--save-exact' : undefined)
    .set('force', force ? '--force' : undefined);

  const yarn = new Map()
    .set('dev', dev ? '--dev' : undefined)
    .set('exact', exact ? '--exact' : undefined)
    .set('force', force ? '--force' : undefined);

  const pnpm = new Map()
    .set('save', save && !saveDev ? '--save-prod' : undefined)
    .set('dev', saveDev ? '--save-dev' : undefined)
    .set('exact', saveExact ? '--save-exact' : undefined);

  const map = { npm, yarn, pnpm };

  return map[packageManager] || npm;
}

/**
 * Gets the prompter from an adapter given an adapter path
 * @param {Object} adapterConfig
 * @param {Object} adapterConfig.config
 * @param {string} adapterConfig.config.path
 * @param {string|null} adapterConfig.filepath
 * @param {boolean} [adapterConfig.isEmpty]
 */
function getPrompter (adapterConfig) {
  // Resolve the adapter path
  let resolvedAdapterPath = resolveAdapterPath(adapterConfig);

  // Load the adapter
  let adapter = require(resolvedAdapterPath);

  /* istanbul ignore next */
  if (adapter && adapter.prompter && isFunction(adapter.prompter)) {
     return adapter.prompter;
  } else if (adapter && adapter.default && adapter.default.prompter && isFunction(adapter.default.prompter)) {
     return adapter.default.prompter;
  } else {
    throw new Error(`Could not find prompter method in the provided adapter module: ${adapterConfig.config.path}`);
  }
}

/**
 * Given a resolvable module name or path, which can be a directory or file, will
 * return a located adapter path or will throw.
 *  * @param {Object} resolvedConfig
 * @param {Object} resolvedConfig.config
 * @param {string} resolvedConfig.config.path
 * @param {string|null} resolvedConfig.filepath pass null when environment config was provided
 * @param {boolean} [resolvedConfig.isEmpty]
 */
function resolveAdapterPath (resolvedConfig) {
  // Check if resolvedConfig is a path or node module name
  const parsed = path.parse(resolvedConfig.config.path);
  const isPath = parsed.dir.length > 0 && parsed.dir.charAt(0) !== "@";
  let absoluteAdapterPath;

  if (resolvedConfig.filepath == null) {
    if (isPath) {
      absoluteAdapterPath = path.resolve(getGitRootPath(), resolvedConfig.config.path)
    } else {
      absoluteAdapterPath = resolvedConfig.config.path;
    }
  } else {
    if (isPath) {
      absoluteAdapterPath = path.resolve(
        path.basename(resolvedConfig.filepath),
        resolvedConfig.config.path
      )
    } else {
      absoluteAdapterPath = resolvedConfig.config.path
    }
  }

  try {
    // try to resolve the given path
    return require.resolve(absoluteAdapterPath);
  } catch (error) {
    error.message = "Could not resolve " + absoluteAdapterPath + ". " + error.message;
    throw error;
  }
}

function getGitRootPath () {
  return childProcess.spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).stdout.trim();
}

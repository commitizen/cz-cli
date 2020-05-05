import childProcess from 'child_process';
import path from 'path';
import * as configLoader from './configLoader';
import * as adapter from './adapter';

let {
  addPathToAdapterConfig,
  generateNpmInstallAdapterCommand,
  getNpmInstallStringMappings,
  generateYarnAddAdapterCommand,
  getYarnAddStringMappings,
} = adapter;

export default init;

const CLI_PATH = path.normalize(path.join(__dirname, '../../'));

/**
 * CZ INIT
 *
 * Init is generally responsible for initializing an adapter in
 * a user's project. The goal is to be able to run
 * `commitizen init` and be prompted for certain fields which
 * will help you install the proper adapter for your project.
 *
 * Init does not actually create the adapter (it defers to adapter
 * for this). Instead, it is specifically designed to help gather
 * and validate the information needed to install the adapter
 * properly without interfering with a previous adapter config.
 */

/**
 * The defaults for init
 */
const defaultInitOptions = {
  save: false,
  saveDev: true,
  saveExact: false,
  force: false,

  // for --yarn use
  // @see https://github.com/commitizen/cz-cli/issues/527#issuecomment-392653897
  yarn: false,
  dev: true,
  exact: false, // should add trailing comma, thus next developer doesn't got blamed for this line
};

/**
 * Runs npm install for the adapter then modifies the config.commitizen as needed
 */
function init (repoPath, adapterNpmName, {
  save = false,
  saveDev = true,
  saveExact = false,
  force = false,
  yarn = false,
  dev = false,
  exact = false,
  includeCommitizen = false
} = defaultInitOptions) {

  // Don't let things move forward if required args are missing
  checkRequiredArguments(repoPath, adapterNpmName);

  // Load the current adapter config
  let adapterConfig = loadAdapterConfig(repoPath);

  // Get the npm string mappings based on the arguments provided
  let stringMappings = yarn ? getYarnAddStringMappings(dev, exact, force) : getNpmInstallStringMappings(save, saveDev, saveExact, force);

  // Generate a string that represents the npm install command
  let installAdapterCommand = yarn ? generateYarnAddAdapterCommand(stringMappings, adapterNpmName) : generateNpmInstallAdapterCommand(stringMappings, adapterNpmName);

  let installCommitizenCommand = yarn ? generateYarnAddAdapterCommand(stringMappings, "commitizen") : generateNpmInstallAdapterCommand(stringMappings, "commitizen");

  // Check for previously installed adapters
  if (adapterConfig && adapterConfig.path && adapterConfig.path.length > 0 && !force) {
    throw new Error(`A previous adapter is already configured. Use --force to override
    adapterConfig.path: ${adapterConfig.path}
    repoPath: ${repoPath}
    CLI_PATH: ${CLI_PATH}
    installAdapterCommand: ${installAdapterCommand}
    adapterNpmName: ${adapterNpmName}
    `);
  }

  try {
    childProcess.execSync(installAdapterCommand, { cwd: repoPath });
    if(includeCommitizen) {
      childProcess.execSync(installCommitizenCommand, { cwd: repoPath });
    }
    addPathToAdapterConfig(CLI_PATH, repoPath, adapterNpmName);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Checks to make sure that the required arguments are passed
 * Throws an exception if any are not.
 */
function checkRequiredArguments (path, adapterNpmName) {
  if (!path) {
    throw new Error("Path is required when running init.");
  }
  if (!adapterNpmName) {
    throw new Error("The adapter's npm name is required when running init.");
  }
}

/**
 * CONFIG
 * Loads and returns the adapter config at key config.commitizen, if it exists
 */
function loadAdapterConfig (cwd) {
  let config = configLoader.load(null, cwd);
  if (config) {
    return config;
  } else {

  }
}

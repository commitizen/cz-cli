import path from 'path';
import * as configLoader from './configLoader';
import {executeShellCommand} from '../../common/util'; 
import * as adapter from './adapter';

let {
  addPathToAdapterConfig,
  generateNpmInstallAdapterCommand,
  getNpmInstallStringMappings
} = adapter;

export default init;

const CLI_PATH = path.normalize(__dirname + '/../../');

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
  force: false
};

/**
 * Runs npm install for the adapter then modifies the config.commitizen as needed
 */
function init(sh, repoPath, adapterNpmName, {
  save = false, 
  saveDev = true, 
  saveExact = false,
  force = false
} = defaultInitOptions) {
  
  // Don't let things move forward if required args are missing
  checkRequiredArguments(sh, repoPath, adapterNpmName);
  
  // Move to the correct directory so we can run commands
  sh.cd(repoPath);
  
  // Load the current adapter config
  let adapterConfig = loadAdapterConfig();
  
  // Get the npm string mappings based on the arguments provided
  let stringMappings = getNpmInstallStringMappings(save, saveDev, saveExact, force);
    
  // Generate a string that represents the npm install command
  let installAdapterCommand = generateNpmInstallAdapterCommand(stringMappings, adapterNpmName);

  // Check for previously installed adapters
  if(adapterConfig && adapterConfig.path && adapterConfig.path.length>0) {
    
    // console.log(`
    //   Previous adapter detected! 
    // `);
    
    if(!force) { 
      
      // console.log(`
      //   Previous adapter detected! 
      // `);
      
      throw 'A previous adapter is already configured. Use --force to override';  
    } else { // Override it
      try {
        executeShellCommand(sh, repoPath, installAdapterCommand);
        addPathToAdapterConfig(sh, CLI_PATH, repoPath, adapterNpmName); 
      } catch (e) {
        console.error(e);
      }
    }
    
  } else {
    
    // console.log(`
    //   No previous adapter was detected 
    // `); 

    try {
      
      executeShellCommand(sh, repoPath, installAdapterCommand);
      addPathToAdapterConfig(sh, CLI_PATH, repoPath, adapterNpmName);
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Checks to make sure that the required arguments are passed
 * Throws an exception if any are not.
 */
function checkRequiredArguments(sh, path, adapterNpmName) {
  if(!sh) {
    throw "You must pass an instance of shelljs when running init.";
  }
  if(!path) {
    throw "Path is required when running init.";
  }
  if(!adapterNpmName) {
    throw "The adapter's npm name is required when running init.";
  }
}

/**
 * CONFIG
 * Loads and returns the adapter config at key config.commitizen, if it exists
 */
function loadAdapterConfig() {
  let config = configLoader.load();
  if(config) {
    return config; 
  } else {
    return;
  }
}
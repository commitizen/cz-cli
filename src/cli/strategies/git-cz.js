import fs from 'fs';
import path from 'path';
import sh from 'shelljs';
import inquirer from 'inquirer';
import {getParsedPackageJsonFromPath} from '../../../common/util';
import {gitCz as gitCzParser, commitizen as commitizenParser} from '../parsers';
import {commit, staging, adapter} from '../../commitizen';
import {addPath} from '../../git';
import * as gitStrategy from './git';

// destructure for shorter apis
let { parse } = gitCzParser;

let { getNearestNodeModulesDirectory, getNearestProjectRootDirectory, getPrompter } = adapter;
let { isClean } = staging; 

export default gitCz;

function gitCz(rawGitArgs, environment, adapterConfig) {

  // See if any override conditions exist.
  
  // In these very specific scenarios we may want to use a different
  // commit strategy than git-cz. For example, in the case of --amend
  let parsedCommitizenArgs = commitizenParser.parse(rawGitArgs);
  
  if(parsedCommitizenArgs.a) {
    // console.log('override -a in place');
    addPath(sh, process.cwd());
  }
  
  if(parsedCommitizenArgs.amend) {
    // console.log('override --amend in place');
    gitStrategy.default(rawGitArgs, environment);
    return;
  }
  
  // Now, if we've made it past overrides, proceed with the git-cz strategy
  let parsedGitCzArgs = parse(rawGitArgs);
 
    // TODO: This can be broken out into its own function. 
    // Basically we're 
    // 1. Walking up the tree to find a node_modules folder
    // 2. Resolving the project root based on the node_modules folder
    // 3. Resolving the adapter bath based on that project root
    let resolvedAdapterConfigPath = path.join(getNearestProjectRootDirectory(), adapterConfig.path);
    
    let prompter = getPrompter(path.resolve(process.cwd(), resolvedAdapterConfigPath));

    isClean(process.cwd(), function(stagingIsClean){
      if(stagingIsClean) {
        console.error('Error: No files added to staging! Did you forget to run git add?')  
      } else {
        let adapterPackageJson = getParsedPackageJsonFromPath(resolvedAdapterConfigPath);
        let cliPackageJson = getParsedPackageJsonFromPath(environment.cliPath);
        console.log(`cz-cli@${cliPackageJson.version}, ${adapterPackageJson.name}@${adapterPackageJson.version}\n`);
        commit(sh, inquirer, process.cwd(), prompter, {args: parsedGitCzArgs, disableAppendPaths:true}, function() {
          // console.log('commit happened');
        });
        
      }
    });
    

}
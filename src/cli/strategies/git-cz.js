import inquirer from 'inquirer';
import findRoot from 'find-root';
import { getParsedPackageJsonFromPath } from '../../common/util';
import { gitCz as gitCzParser, commitizen as commitizenParser } from '../parsers';
import { commit, staging, adapter } from '../../commitizen';
import * as gitStrategy from './git';

// destructure for shorter apis
let { parse } = gitCzParser;

let { getPrompter, resolveAdapterPath, getGitRootPath } = adapter;
let { isClean } = staging;

export default gitCz;

function gitCz (rawGitArgs, environment, adapterConfig) {

  // See if any override conditions exist.

  // In these very specific scenarios we may want to use a different
  // commit strategy than git-cz. For example, in the case of --amend
  let parsedCommitizenArgs = commitizenParser.parse(rawGitArgs);

  if (parsedCommitizenArgs.amend) {
    // console.log('override --amend in place');
    gitStrategy.default(rawGitArgs, environment);
    return;
  }

  // Now, if we've made it past overrides, proceed with the git-cz strategy
  let parsedGitCzArgs = parse(rawGitArgs);

  // Determine if we need to process this commit as a retry instead of a
  // normal commit.
  let retryLastCommit = rawGitArgs && rawGitArgs[0] === '--retry';

  // Determine if we need to process this commit using interactive hook mode
  // for husky prepare-commit-message
  let hookMode = !(typeof parsedCommitizenArgs.hook === 'undefined');

  let resolvedAdapterConfigPath = resolveAdapterPath(adapterConfig.path);
  let resolvedAdapterRootPath = findRoot(resolvedAdapterConfigPath);
  let prompter = getPrompter(adapterConfig.path);
  let shouldStageAllFiles = rawGitArgs.includes('-a') || rawGitArgs.includes('--all');

  isClean(process.cwd(), function (error, stagingIsClean) {
    if (error) {
      throw error;
    }

    if (stagingIsClean && !parsedGitCzArgs.includes('--allow-empty')) {
      throw new Error('No files added to staging! Did you forget to run git add?');
    }

    // OH GOD IM SORRY FOR THIS SECTION
    let adapterPackageJson = getParsedPackageJsonFromPath(resolvedAdapterRootPath);
    let cliPackageJson = getParsedPackageJsonFromPath(environment.cliPath);
    console.log(`cz-cli@${cliPackageJson.version}, ${adapterPackageJson.name}@${adapterPackageJson.version}\n`);
    commit(inquirer, getGitRootPath(), prompter, {
      args: parsedGitCzArgs,
      disableAppendPaths: true,
      emitData: true,
      quiet: false,
      retryLastCommit,
      hookMode
    }, function (error) {
      if (error) {
        throw error;
      }
      process.exit(0);
    });
  }, shouldStageAllFiles);

}

import { configLoader } from '../commitizen';
import { gitCz as useGitCzStrategy } from './strategies';

export {
  bootstrap
};

/**
 * This is the main cli entry point.
 * environment may be used for debugging.
 */
function bootstrap(environment = {}, argv = process.argv) {

  // Get cli args
  let rawGitArgs = argv.slice(2, argv.length);

  let adapterConfig = environment.config || configLoader.load() || { path: 'cz-conventional-changelog' };

  useGitCzStrategy(rawGitArgs, environment, adapterConfig);
}

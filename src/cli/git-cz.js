import { configLoader } from '../commitizen';
import { git as useGitStrategy, gitCz as useGitCzStrategy } from './strategies';

export {
  bootstrap
};

/**
 * This is the main cli entry point.
 * environment may be used for debugging.
 */
function bootstrap (environment = {}, argv = process.argv) {

  // Get cli args
  let rawGitArgs = argv.slice(2, argv.length);

  let adapterConfig = environment.config || configLoader.load();

  // Choose a strategy based on the existance the adapter config
  if (typeof adapterConfig !== 'undefined') {
    // This tells commitizen we're in business
    useGitCzStrategy(rawGitArgs, environment, adapterConfig);
  } else {
    // This tells commitizen that it is not needed, just use git
    useGitStrategy(rawGitArgs, environment);
  }
}

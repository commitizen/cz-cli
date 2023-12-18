import { loadConfig } from '../configLoader/loader';
import { git as useGitStrategy, gitCz as useGitCzStrategy } from './strategies';
import { createEnvironmentConfig } from "../common/util";

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

  let adapterConfig;
  if (environment.config) {
    adapterConfig = createEnvironmentConfig(environment.config);
  } else {
    adapterConfig = loadConfig();
  }

  // Choose a strategy based on the existance the adapter config
  if (typeof adapterConfig !== 'undefined') {
    // This tells commitizen we're in business
    useGitCzStrategy(rawGitArgs, environment, adapterConfig);
  } else {
    // This tells commitizen that it is not needed, just use git
    useGitStrategy(rawGitArgs, environment);
  }
}

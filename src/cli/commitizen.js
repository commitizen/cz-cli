import { init } from '../commitizen';
import { commitizen as commitizenParser } from './parsers';

let { parse } = commitizenParser;

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

  // Parse the args
  let parsedArgs = parse(rawGitArgs);
  let command = parsedArgs._[0];

  // Do actions based on commands
  if (command === "init") {
    let adapterNpmName = parsedArgs._[1];
    if (adapterNpmName) {
      console.log(`Attempting to initialize using the npm package ${adapterNpmName}`);
      try {
        init(process.cwd(), adapterNpmName, parsedArgs);
      } catch (e) {
        console.error(`Error: ${e}`);
      }
    } else {
      console.error('Error: You must provide an adapter name as the second argument.');
    }
  } else {
    console.log(`

    Commitizen has two command line tools:

      1) cz         -- used for making commits according to convention
                       note: you can run 'git cz' if installed with -g
      2) git-cz     -- alias for 'cz'
      3) commitizen -- used for installing adapters into your project

    Generally if you're using someone else's repo and they've already set up an
    adapter, you're going to just be running:

         cz

    However, if you create a new repo and you want to make it easier for future
    contributors to follow your commit message conventions using commitizen then
    you'll need to run a command like this one to add this adapter to your config:

         commitizen init cz-conventional-changelog --save

    You should swap out cz-conventional-changelog for the NPM package name of the
    adapter you wish you install in your project's package.json.

    Detailed usage:

      1) commitizen <sub-command>

         init <adapter-npm-name> [args]

           description: Install a commitizen adapter from npm and adds it to your
                        config.commitizen in your package.json file.

           args:
             --save         Install the adapter to package.json dependencies
             --save-dev     Install the adapter to devDependencies
             --save-exact   Install an exact version instead of a range
             --force        Force install the adapter, even if a previous one exists.

      2) cz <any regular git commit arguments>

          description: Runs the commitizen prompter, asking you questions so that you
                       follow the commit conventions of the repository of the current
                       directory.

                       note: cz may even be run as 'git cz' if installed with -g.

    `);
  }

}

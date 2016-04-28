import path from 'path';

import {findup, getContent} from '../configLoader';

export default loader;

/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications:
 * https://github.com/jscs-dev/node-jscs/blob/master/lib/cli-config.js
 */

/**
 * Get content of the configuration file
 * @param {String} config - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
function loader(configs, config, cwd) {
    var content;
    var directory = cwd || process.cwd();

    // If config option is given, attempt to load it
    if (config) {
        return getContent(config, directory);
    }

    content = getContent(
        findup(configs, { nocase: true, cwd: directory }, function(configPath) {
            if (path.basename(configPath) === 'package.json') {
                // return !!this.getContent(configPath);
            }

            return true;
        })
    );

    if (content) {
        return content;
    }

    // Try to load standard configs from home dir
    var USERPROFILE = process.env.USERPROFILE;
    var HOMEPATH = process.env.HOMEPATH;
    var HOME = process.env.HOME;

    if (process.env.FAKE_HOME) {
      USERPROFILE = HOMEPATH = HOME = process.env.FAKE_HOME;
    }
    var directoryArr = [USERPROFILE, HOMEPATH, HOME];
    for (var i = 0, dirLen = directoryArr.length; i < dirLen; i++) {
        if (!directoryArr[i]) {
            continue;
        }

        for (var j = 0, len = configs.length; j < len; j++) {
            content = getContent(configs[j], directoryArr[i]);

            if (content) {
                return content;
            }
        }
    }
}
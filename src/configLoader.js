
/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications: 
 * https://github.com/jscs-dev/node-jscs/blob/master/lib/cli-config.js
 */

var fs = require('fs');
var path = require('path');

var stripJSONComments = require('strip-json-comments');
var supportsColor = require('chalk').supportsColor;
var glob = require('glob');

// Configuration sources in priority order.
var configs = ['package.json', '.czrc', '.cz.json'];

// Before, "findup-sync" package was used,
// but it does not provide filter callback
function findup(patterns, options, fn) {
    /* jshint -W083 */

    var lastpath;
    var file;

    options = Object.create(options);
    options.maxDepth = 1;
    options.cwd = path.resolve(options.cwd);

    do {
        file = patterns.filter(function(pattern) {
            var configPath = glob.sync(pattern, options)[0];

            if (configPath) {
                return fn(path.join(options.cwd, configPath));
            }
        })[0];

        if (file) {
            return path.join(options.cwd, file);
        }

        lastpath = options.cwd;
        options.cwd = path.resolve(options.cwd, '..');
    } while (options.cwd !== lastpath);
}

/**
 * Get content of the configuration file
 * @param {String} config - partial path to configuration file
 * @param {String} directory - directory path which will be joined with config argument
 * @return {Object}
 */
exports.getContent = function(config, directory) {
    if (!config) {
        return;
    }

    var configPath = path.resolve(directory, config);
    var ext;
    var content;

    config = path.basename(config);

    if (fs.existsSync(configPath)) {
        ext = path.extname(configPath);

        if (ext === '.js' || ext === '.json') {
            content = require(configPath);
        } else {
            content = JSON.parse(
                stripJSONComments(
                    fs.readFileSync(configPath, 'utf8')
                )
            );
        }

        // Adding property via Object.defineProperty makes it
        // non-enumerable and avoids warning for unsupported rules
        Object.defineProperty(content, 'configPath', {
            value: configPath
        });
    }

    return content && config === 'package.json' ? content.czConfig : content;
};

/**
 * Get content of the configuration file
 * @param {String} config - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */
exports.load = function(config, cwd) {
    var content;
    var directory = cwd || process.cwd();

    // If config option is given, attempt to load it
    if (config) {
        return this.getContent(config, directory);
    }

    content = this.getContent(
        findup(configs, { nocase: true, cwd: directory }, function(configPath) {
            if (path.basename(configPath) === 'package.json') {
                return !!this.getContent(configPath);
            }

            return true;
        }.bind(this))
    );

    if (content) {
        return content;
    }

    // Try to load standard configs from home dir
    var directoryArr = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];
    for (var i = 0, dirLen = directoryArr.length; i < dirLen; i++) {
        if (!directoryArr[i]) {
            continue;
        }

        for (var j = 0, len = configs.length; j < len; j++) {
            content = this.getContent(configs[j], directoryArr[i]);

            if (content) {
                return content;
            }
        }
    }
};

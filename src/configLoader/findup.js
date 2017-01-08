import path from 'path';
import glob from 'glob';

export default findup;

// Before, "findup-sync" package was used,
// but it does not provide filter callback
function findup (patterns, options, fn) {
    /* jshint -W083 */

    var lastpath;
    var file;

    options = Object.create(options);
    options.maxDepth = 1;
    options.cwd = path.resolve(options.cwd);

    do {
        file = patterns.filter(function (pattern) {
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

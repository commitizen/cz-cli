import fs from 'fs';
import path from 'path';
import stripJSONComments from 'strip-json-comments';

import {getNormalizedConfig} from '../configLoader';

export default getContent;

/**
 * Get content of the configuration file
 * @param {String} config - partial path to configuration file
 * @param {String} directory - directory path which will be joined with config argument
 * @return {Object}
 */
function getContent(config, directory) {
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
            content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
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
    return getNormalizedConfig(config, content);
    
};
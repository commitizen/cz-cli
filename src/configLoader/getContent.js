import fs from 'fs';
import path from 'path';
import {sync as existsSync} from 'path-exists';
import stripJSONComments from 'strip-json-comments';

import {getNormalizedConfig} from '../configLoader';

export default getConfigContent;

/**
 * Read the content of a configuration file
 * - if not js or json: strip any comments
 * - if js or json: require it
 * @param {String} configPath - full path to configuration file
 * @return {Object}
 */
function readConfigContent (configPath) {
    const parsedPath = path.parse(configPath)
    const isRcFile = parsedPath.ext !== '.js' && parsedPath.ext !== '.json';
    const jsonString = fs.readFileSync(configPath, 'utf-8');
    const parse = isRcFile ?
      (contents) => JSON.parse(stripJSONComments(contents)) :
      (contents) => JSON.parse(contents);

    try {
        const parsed = parse(jsonString);

        Object.defineProperty(parsed, 'configPath', {
          value: configPath
        });

        return parsed;
    } catch (error) {
        error.message = [
          `Parsing JSON at ${configPath} for commitizen config failed:`,
          error.mesasge
        ].join('\n');

        throw error;
    }
}

/**
 * Get content of the configuration file
 * @param {String} configPath - partial path to configuration file
 * @param {String} directory - directory path which will be joined with config argument
 * @return {Object}
 */
function getConfigContent (configPath, baseDirectory) {
    if (!configPath) {
      return;
    }

    const resolvedPath = path.resolve(baseDirectory, configPath);
    const configBasename = path.basename(resolvedPath);

    if (!existsSync(resolvedPath)) {
      return getNormalizedConfig(resolvedPath);
    }

    const content = readConfigContent(resolvedPath);
    return getNormalizedConfig(configBasename, content);
};

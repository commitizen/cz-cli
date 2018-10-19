import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export {
  writeFilesToPath
};

/**
 * Opinionated writing of files to a path.
 *
 * Expects files to be an object where each sub
 * object has properties filename and contents.
 */
function writeFilesToPath (files, directoryPath) {
  _.forOwn(files, function (key, value) {
    fs.writeFileSync(path.resolve(directoryPath, files[value].filename), files[value].contents);
  });
}

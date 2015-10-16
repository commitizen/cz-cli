import minimist from 'minimist';

import { isString, isArray } from '../../../common/util';

export {
  parse
};

/**
 * Takes args, parses with minimist and some ugly vudoo, returns output
 * 
 * TODO: Aww shit this is ugly. Rewrite with mega leet tests plz, kthnx.
 */
function parse(rawGitArgs) {

  var args = minimist(rawGitArgs, { 
    alias: {
      m: 'message'
    }
  });

  // Loop through all keys
  var output = ' ';

  for (let arg in args) {

    if (!args.hasOwnProperty(arg)) {
      //The current property is not a direct property
      continue;
    }

    var key = arg;
    var value = args[arg];

    /**
     * Ugly, but this is recompiles an argument string without 
     * any messages passed in.
     */
    if (key === '_' && value.length > 0) {
      // Anything in the _ array of strings is a one off file
      output += value.join(' ') + ' ';
    } else if (key === 'message') {
      /**
       * We strip out message because we're already handling this
       * in minimist's aliases.
       */
      continue;
    } else if (isString(value)) {
      output += '-' + key + ' ' + value + ' ';
    } else if (isArray(value) && value.length>0) {
      output += '-' + key + ' ' + value.join(' -' + key) + ' ';
    } else if (value === true || value === false) {
      output += '-' + key + ' ';
    } else {
      /**
       * Based on the current minimist object structure, we should
       * never get here, but we'll protect against breaking changes.
       */
      continue;
    }
  }

  if(output.trim().length < 1) {
    return '';
  } else {
    return output;
  }
}
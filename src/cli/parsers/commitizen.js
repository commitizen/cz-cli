import minimist from 'minimist';

import { isString, isArray } from '../../common/util';

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
     boolean: true
   });
   
   return args;
}
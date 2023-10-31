import { cosmiconfigSync, defaultLoadersSync } from 'cosmiconfig';
import JSON5 from 'json5';
import stripBom from 'strip-bom';
import isUTF8 from "is-utf8";

const moduleName = 'cz';
const fullModuleName = 'commitizen';

const searchPlaces = [
  `.${moduleName}rc`, // .czrc
  `.${moduleName}rc.json`,
  `.${moduleName}rc.json5`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.cjs`,
  `.${moduleName}rc.ts`,
  `.config/${moduleName}rc`,
  `.config/${moduleName}rc.json`,
  `.config/${moduleName}rc.json5`,
  `.config/${moduleName}rc.yaml`,
  `.config/${moduleName}rc.yml`,
  `.config/${moduleName}rc.js`,
  `.config/${moduleName}rc.ts`,
  `.config/${moduleName}rc.cjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.ts`,
  `${moduleName}.config.cjs`,
  `.${moduleName}.json`, // .cz.json
  `.${moduleName}.json5`,
  'package.json',
];

function withSafeContentLoader(loader) {
  return function (filePath, content) {
    if (!isUTF8(Buffer.from(content, 'utf8'))) {
      throw new Error(`The config file at "${filePath}" contains invalid charset, expect utf8`);
    }
    return loader(filePath, stripBom(content));
  }
}

function json5Loader(filePath, content) {
  try {
    return JSON5.parse(content) || null;
  } catch (err) {
    err.message = `Error parsing json at ${filePath}:\n${err.message}`;
    throw err;
  }
}

// no '.ts': withSafeContentLoader(defaultLoadersSync['.ts']),
const loaders = {
  '.cjs': withSafeContentLoader(defaultLoadersSync['.js']),
  '.js': withSafeContentLoader(defaultLoadersSync['.js']),
  '.yml': withSafeContentLoader(defaultLoadersSync['.yaml']),
  '.json': withSafeContentLoader(json5Loader),
  '.json5': withSafeContentLoader(json5Loader),
  '.yaml': withSafeContentLoader(defaultLoadersSync['.yaml']),
  '.ts': withSafeContentLoader(defaultLoadersSync['.ts']),
  noExt: withSafeContentLoader(json5Loader)
}

const defaultConfigExplorer = cosmiconfigSync(moduleName, {
  packageProp: ['configs', fullModuleName],
  searchPlaces: searchPlaces,
  loaders: loaders,
  cache: false,
});

/**
 * @deprecated
 */
const deprecatedConfigExplorerFallback = cosmiconfigSync(moduleName, {
  packageProp: ['czConfig'],
  searchPlaces: ['package.json'],
  loaders: loaders,
  cache: false,
});

export { searchPlaces, moduleName, defaultConfigExplorer, deprecatedConfigExplorerFallback };

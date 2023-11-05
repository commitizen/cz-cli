import { cosmiconfigSync, defaultLoaders, OptionsSync } from 'cosmiconfig';
import JSON5 from 'json5';
import stripBom from 'strip-bom';
import isUTF8 from "is-utf8";

const moduleName = 'cz';
const fullModuleName = 'commitizen';
const packageJsonConfigPath = 'config';

const searchPlaces = [
  `.${moduleName}rc`, // .czrc
  `.${moduleName}rc.json`,
  `.${moduleName}rc.json5`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.cjs`,
  // `.${moduleName}rc.ts`,
  `.config/${moduleName}rc`,
  `.config/${moduleName}rc.json`,
  `.config/${moduleName}rc.json5`,
  `.config/${moduleName}rc.yaml`,
  `.config/${moduleName}rc.yml`,
  `.config/${moduleName}rc.js`,
  // `.config/${moduleName}rc.ts`,
  `.config/${moduleName}rc.cjs`,
  `${moduleName}.config.js`,
  // `${moduleName}.config.ts`,
  `${moduleName}.config.cjs`,
  `.${moduleName}.json`, // .cz.json
  `.${moduleName}.json5`,
  'package.json',
];

function withSafeContentLoader (loader) {
  return function (filePath, content) {
    if (!isUTF8(Buffer.from(content, 'utf8'))) {
      throw new Error(`The config file at "${filePath}" contains invalid charset, expect utf8`);
    }
    return loader(filePath, stripBom(content));
  }
}

function json5Loader (filePath, content) {
  try {
    return JSON5.parse(content);
  } catch (err) {
    err.message = `Error parsing json at ${filePath}:\n${err.message}`;
    throw err;
  }
}

const loaders = {
  '.cjs': withSafeContentLoader(defaultLoaders['.js']),
  '.js': withSafeContentLoader(defaultLoaders['.js']),
  '.yml': withSafeContentLoader(defaultLoaders['.yaml']),
  '.json': withSafeContentLoader(json5Loader),
  '.json5': withSafeContentLoader(json5Loader),
  '.yaml': withSafeContentLoader(defaultLoaders['.yaml']),
  '.ts': withSafeContentLoader(defaultLoaders['.ts']),
  noExt: withSafeContentLoader(json5Loader)
}

/**
 *
 * @param {OptionsSync} [optionsSync] absolute or relative path where config lookup should stop. Given cwd stop lookup at cwd dir.
 */
const defaultConfigExplorer = (optionsSync) => {
  return cosmiconfigSync(moduleName, {
    packageProp: [packageJsonConfigPath, fullModuleName],
    searchPlaces: searchPlaces,
    loaders: loaders,
    cache: false,
    ...optionsSync
  });
};

export {
  searchPlaces,
  moduleName,
  packageJsonConfigPath,
  fullModuleName,
  defaultConfigExplorer,
  json5Loader,
};

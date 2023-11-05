import { expect } from 'chai';
import fs from "fs";
import path from "path";

import { configLoader } from '../../src/commitizen';
// Bootstrap our tester
import { bootstrap } from '../tester';
import { writeFilesToPath } from "../tools/files";

let { config, repo, clean, files } = bootstrap();

const { load, loadAtRoot } = configLoader;

before(function () {
  // Creates the temp path
  clean.before(config.paths.tmp);
});

beforeEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  /* istanbul ignore next */
  repo.createEndUser(config.paths.endUserRepo);
});

afterEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // All this should do is archive the tmp path to the artifacts
  clean.afterEach(config.paths.tmp, config.preserve);
});

after(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // Once everything is done, the artifacts should be cleaned up based on
  // the preserve setting in the config
  clean.after(config.paths.tmp, config.preserve);
});

describe('commitizen configLoader public api', function () {
  describe('load', function () {
    it('should find config at root', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc`,
          },
        },
      };

      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(load(undefined, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });

    it('should find config at upper folders', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };

      const file = {
        czrc: {
          contents: `{
            "path": "right config"
          }`,
          filename: `.czrc`,
        },
      };

      fs.writeFileSync(path.resolve(repoConfig.path, '../', file.czrc.filename), file.czrc.contents);

      expect(load(undefined, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });

    it('should prefer config at root', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc`,
          },
        },
      };

      const wrongFile = {
        czrc: {
          contents: `{
            "path": "wrong config"
          }`,
          filename: `.czrc`,
        },
      };

      fs.writeFileSync(path.resolve(repoConfig.path, '..', wrongFile.czrc.filename), wrongFile.czrc.contents);

      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(load(undefined, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });

    it('should load config at given path with given name if provided', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `{
              "path": "wrong config"
            }`,
            filename: `.czrc`,
          },
          czrcjson: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc.json`,
          },
        },
      };

      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(load(repoConfig.files.czrcjson.filename, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });

    it('should throw when no file exist', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcjson: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc.json`,
          },
        },
      };

      expect(() => load(repoConfig.files.czrcjson.filename, repoConfig.path)).to.throw;
    });

    it('should return undefined when no file exists in all upper paths and root', function () {
      expect(load(undefined, path.resolve('/'))).to.be.undefined;
    });
  });

  describe('loadAtRoot', function () {
    it('should find config at root', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc`,
          },
        },
      };

      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loadAtRoot(undefined, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });

    it('should ignore upper level configs config at upper folders', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };

      const file = {
        czrc: {
          contents: `{
            "path": "right config"
          }`,
          filename: `.czrc`,
        },
      };

      fs.writeFileSync(path.resolve(repoConfig.path, '../', file.czrc.filename), file.czrc.contents);

      expect(loadAtRoot(undefined, repoConfig.path)).to.be.undefined;
    });

    it('should throw when no file exist', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcjson: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc.json`,
          },
        },
      };

      expect(() => loadAtRoot(repoConfig.files.czrcjson.filename, repoConfig.path)).to.throw;
    });

    it('should load config at given path with given name if provided', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `{
              "path": "wrong config"
            }`,
            filename: `.czrc`,
          },
          czrcjson: {
            contents: `{
              "path": "right config"
            }`,
            filename: `.czrc.json`,
          },
        },
      };

      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loadAtRoot(repoConfig.files.czrcjson.filename, repoConfig.path)).to.deep.equal({ path: 'right config' });
    });
  });
});

import { expect } from 'chai';
import { loader } from "../../src/configLoader";
import fs from 'fs';
import path from 'path';

// Bootstrap our tester
import { bootstrap } from '../tester';


let { config, repo, clean, files } = bootstrap();
let { writeFilesToPath } = files;

const defaultConfigString = `{
  // this is json5 format
  path: 'cz-conventional-changelog'
}`

const defaultConfigObj = {
  path: 'cz-conventional-changelog'
};

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

describe('configLoader cosmiconfig', function () {
  it('should load .czrc json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `.czrc`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .czrc.json json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `.czrc.json`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .czrc.json5 json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `.czrc.json5`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load package.json format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        packagejson: {
          contents: `{
            "configs": {
              "commitizen": {
                "path": "cz-conventional-changelog"
              }
            }
          }`,
          filename: `package.json`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load package.json format deprecated czConfig', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        packagejson: {
          contents: `{
            "czConfig": {
                "path": "cz-conventional-changelog"
              }
          }`,
          filename: `package.json`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .cz.json config', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czjson: {
          contents: defaultConfigString,
          filename: `.cz.json`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .czrc.js config', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrcjs: {
          contents: `
            module.exports = {
              path: "cz-conventional-changelog",
            };
          `,
          filename: `.czrc.js`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .czrc.yaml config', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrcyaml: {
          contents: `
            path: cz-conventional-changelog
          `,
          filename: `.czrc.yaml`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .czrc.yml config', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrcyml: {
          contents: `
            path: 'cz-conventional-changelog'
          `,
          filename: `.czrc.yml`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  // because haven't typescript
  it.skip('should load .czrc.ts config', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrcts: {
          contents: `
            type Config = {
              path: string;
            }

            const cfg: Config = {
              path: 'cz-conventional-changelog',
            };

            module.exports = cfg;
          `,
          filename: `.czrc.ts`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `czrc`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc.json json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `czrc.json`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc.json5 json5 format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: defaultConfigString,
          filename: `czrc.json5`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc.yaml format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: `
            path: 'cz-conventional-changelog'
          `,
          filename: `czrc.yaml`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc.yml format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: `
            path: 'cz-conventional-changelog'
          `,
          filename: `czrc.yml`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load .config/czrc.js format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: `
            module.exports = {
              path: "cz-conventional-changelog",
            };
          `,
          filename: `czrc.js`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  // because haven't typescript
  it.skip('should load .config/czrc.ts format', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrc: {
          contents: `
            type Config = {
              path: string;
            }

            const cfg: Config = {
              path: 'cz-conventional-changelog',
            };

            module.exports = cfg;
          `,
          filename: `czrc.ts`,
        },
      }
    };
    const dir = path.join(repoConfig.path, '.config');

    fs.mkdirSync(dir);
    writeFilesToPath(repoConfig.files, dir);
    expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  it('should load any config by given name and path', function () {
    const repoConfig = {
      path: config.paths.endUserRepo,
      files: {
        czrcjs: {
          contents: `
            module.exports = {
              path: "cz-conventional-changelog",
            };
          `,
          filename: `.czrc.js`,
        },
      }
    };
    writeFilesToPath(repoConfig.files, repoConfig.path);
    expect(loader(`.czrc.js`, repoConfig.path)).deep.equal(defaultConfigObj);
  });

  describe('files with BOM', function () {
    it('should load .czrc.json json5 format BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrc: {
            contents: `\ufeff{
  // this is json5 format
  path: 'cz-conventional-changelog'
}`,
            filename: `.czrc.json`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });

    // can have BOM?
    it.skip('should load package.json format BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          packagejson: {
            contents: `\ufeff{
            "configs": {
              "commitizen": {
                "path": "cz-conventional-changelog"
              }
            }
          }`,
            filename: `package.json`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });

    it('should load .czrc.js config BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcjs: {
            contents: `\ufeff
            module.exports = {
              path: "cz-conventional-changelog",
            };
          `,
            filename: `.czrc.js`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });

    it('should load .czrc.yaml config BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcyaml: {
            contents: `\ufeff
            path: cz-conventional-changelog
          `,
            filename: `.czrc.yaml`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });

    it('should load .czrc.yml config BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcyml: {
            contents: `\ufeff
            path: 'cz-conventional-changelog'
          `,
            filename: `.czrc.yml`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });

    // because haven't typescript
    it.skip('should load .czrc.ts config BOM', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
        files: {
          czrcts: {
            contents: `\ufeff
            type Config = {
              path: string;
            }

            const cfg: Config = {
              path: 'cz-conventional-changelog',
            };

            module.exports = cfg;
          `,
            filename: `.czrc.ts`,
          },
        }
      };
      writeFilesToPath(repoConfig.files, repoConfig.path);
      expect(loader(undefined, repoConfig.path)).deep.equal(defaultConfigObj);
    });
  });

  describe('non utf8 files', function () {
    it('should throw .czrc.json json5 non utf8', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };

      const file = {
        contents: `{
          // this is json5 format
          path: 'cz-conventional-changelog'
        }`,
        filename: `.czrc.json`,
      };

      fs.writeFileSync(path.resolve(repoConfig.path, file.filename), file.contents, { encoding: "utf16le" })
      expect(() => loader(undefined, repoConfig.path)).to.throw(/invalid charset/i);
    });

    it('should throw .czrc.js config non utf8', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };
      const file = {
        contents: `\ufeff
            module.exports = {
              path: "cz-conventional-changelog",
            };
          `,
        filename: `.czrc.js`,
      }
      fs.writeFileSync(path.resolve(repoConfig.path, file.filename), file.contents, { encoding: "utf16le" })
      expect(() => loader(undefined, repoConfig.path)).to.throw(/invalid charset/i);
    });

    it('should throw .czrc.yaml config non utf8', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };

      const file = {
        contents: `\ufeff
            path: cz-conventional-changelog
          `,
        filename: `.czrc.yaml`,
      };

      fs.writeFileSync(path.resolve(repoConfig.path, file.filename), file.contents, { encoding: "utf16le" })
      expect(() => loader(undefined, repoConfig.path)).to.throw(/invalid charset/i);
    });

    // because haven't typescript
    it.skip('should throw .czrc.ts config non utf8', function () {
      const repoConfig = {
        path: config.paths.endUserRepo,
      };

      const file = {
        contents: `\ufeff
            type Config = {
              path: string;
            }

            const cfg: Config = {
              path: 'cz-conventional-changelog',
            };

            module.exports = cfg;
          `,
        filename: `.czrc.ts`,
      };

      fs.writeFileSync(path.resolve(repoConfig.path, file.filename), file.contents, { encoding: "utf16le" })
      expect(() => loader(undefined, repoConfig.path)).to.throw(/invalid charset/i);
    });
  });
});

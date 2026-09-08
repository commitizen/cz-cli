import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';

import { findup, getContent, getNormalizedConfig, loader } from '../../src/configLoader';

const fixturesPath = path.resolve(__dirname, '..', 'fixtures');

describe('configLoader', function () {

  it('errors appropriately for invalid json', function () {
    expect(() => getContent('invalid-json.json', fixturesPath))
      .to.throw(/parsing json at/i);
    expect(() => getContent('invalid-json-rc', fixturesPath))
      .to.throw(/parsing json at/i);
    expect(() => getContent('invalid-charset.json', fixturesPath))
      .to.throw(/contains invalid charset/i);
  });

  it('parses json files with comments', function () {
    expect(getContent('valid-json-rc', fixturesPath))
      .to.deep.equal({ 'some': 'json' });
  });

  it('returns undefined when no config path is given', function () {
    expect(getContent(undefined, fixturesPath)).to.equal(undefined);
    expect(getContent('', fixturesPath)).to.equal(undefined);
  });

  it('returns undefined when the config file does not exist', function () {
    expect(getContent(`${uuidv4()}.json`, fixturesPath)).to.equal(undefined);
  });

  it('normalizes package.json configs', function () {

    let config = 'package.json';

    let npmStyleConfig = {
      config: {
        commitizen: 'myNpmConfig'
      }
    };

    let oldStyleConfig = {
      czConfig: 'myOldConfig'
    };

    expect(getNormalizedConfig(config, npmStyleConfig)).to.equal('myNpmConfig');
    expect(getNormalizedConfig(config, oldStyleConfig)).to.equal('myOldConfig');

  });

  it('returns undefined for a package.json with neither config.commitizen nor czConfig', function () {
    expect(getNormalizedConfig('package.json', { name: 'demo' })).to.equal(undefined);
  });

  it('returns undefined for a package.json with no content', function () {
    expect(getNormalizedConfig('package.json')).to.equal(undefined);
  });

  it('normalizes .cz.json configs', function () {

    let config = '.cz.json';

    let czJsonStyleConfig = {
      path: './path/to/adapter'
    };

    expect(getNormalizedConfig(config, czJsonStyleConfig)).to.deep.equal({ path: './path/to/adapter' });

  });

  it('normalizes .czrc configs', function () {

    let config = '.czrc';

    let czrcStyleConfig = {
      path: './path/to/adapter'
    };

    expect(getNormalizedConfig(config, czrcStyleConfig)).to.deep.equal({ path: './path/to/adapter' });

  });

  describe('loader', function () {
    it('loads an explicitly provided config path directly', function () {
      expect(loader(['ignored'], 'valid-json-rc', fixturesPath)).to.deep.equal({ some: 'json' });
    });

    it('discovers a config file in the given directory', function () {
      expect(loader(['valid-json-rc'], undefined, fixturesPath)).to.deep.equal({ some: 'json' });
    });

    it('returns undefined when nothing is found (and not falling through to $HOME during tests)', function () {
      const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cz-loader-'));
      try {
        expect(loader(['.czrc', '.cz.json'], undefined, emptyDir)).to.equal(undefined);
      } finally {
        fs.rmSync(emptyDir, { recursive: true, force: true });
      }
    });

    it('defaults the search directory to process.cwd()', function () {
      // The test process runs from the repo root, which is itself
      // commitizen-friendly, so package.json discovery should succeed.
      expect(loader(['package.json'], undefined, undefined)).to.have.property('path');
    });
  });

  describe('findup', function () {
    let base;

    beforeEach(function () {
      base = fs.mkdtempSync(path.join(os.tmpdir(), 'cz-findup-'));
      fs.mkdirSync(path.join(base, 'a', 'b', 'c'), { recursive: true });
    });

    afterEach(function () {
      fs.rmSync(base, { recursive: true, force: true });
    });

    it('walks up parent directories to find a matching file', function () {
      const marker = path.join(base, 'a', '.czmarker');
      fs.writeFileSync(marker, '{}');

      const found = findup(['.czmarker'], { cwd: path.join(base, 'a', 'b', 'c') }, () => true);

      expect(found).to.equal(marker);
    });

    it('returns undefined when the file is never found on the way up to the root', function () {
      const found = findup(['does-not-exist-' + uuidv4()], { cwd: path.join(base, 'a', 'b', 'c') }, () => true);
      expect(found).to.equal(undefined);
    });

    it('skips matches rejected by the filter callback', function () {
      fs.writeFileSync(path.join(base, 'a', 'b', 'c', '.czmarker'), '{}');

      const found = findup(['.czmarker'], { cwd: path.join(base, 'a', 'b', 'c') }, () => false);

      expect(found).to.equal(undefined);
    });
  });

});

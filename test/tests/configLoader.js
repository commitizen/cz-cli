import path from 'path';
import { expect } from 'chai';
import { getContent, getNormalizedConfig } from '../../src/configLoader';

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

});

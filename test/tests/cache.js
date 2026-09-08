import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';

import { getCacheValueSync, readCacheSync, setCacheValueSync } from '../../src/commitizen/cache';

describe('commitizen cache', () => {

  let cachePath;

  beforeEach(() => {
    cachePath = path.join(os.tmpdir(), `cz-cache-${uuidv4()}.json`);
  });

  afterEach(() => {
    try {
      fs.unlinkSync(cachePath);
    } catch (e) {
      // nothing to clean up
    }
  });

  it('creates the cache file when setting a value for the first time', () => {
    const cache = setCacheValueSync(cachePath, '/repo/a', { template: 'first' });

    expect(cache).to.deep.equal({ '/repo/a': { template: 'first' } });
    expect(readCacheSync(cachePath)).to.deep.equal({ '/repo/a': { template: 'first' } });
  });

  it('merges into an existing cache instead of clobbering it', () => {
    setCacheValueSync(cachePath, '/repo/a', { template: 'a' });
    setCacheValueSync(cachePath, '/repo/b', { template: 'b' });

    expect(readCacheSync(cachePath)).to.deep.equal({
      '/repo/a': { template: 'a' },
      '/repo/b': { template: 'b' }
    });
  });

  it('overwrites the value for a key that already exists', () => {
    setCacheValueSync(cachePath, '/repo/a', { template: 'old' });
    setCacheValueSync(cachePath, '/repo/a', { template: 'new' });

    expect(getCacheValueSync(cachePath, '/repo/a')).to.deep.equal({ template: 'new' });
  });

  it('reads a stored value back by key', () => {
    setCacheValueSync(cachePath, '/repo/a', { template: 'hello' });

    expect(getCacheValueSync(cachePath, '/repo/a')).to.deep.equal({ template: 'hello' });
  });

  it('returns undefined for a missing key', () => {
    setCacheValueSync(cachePath, '/repo/a', { template: 'hello' });

    expect(getCacheValueSync(cachePath, '/repo/missing')).to.equal(undefined);
  });

  it('returns undefined (rather than throwing) when the cache file does not exist', () => {
    expect(getCacheValueSync(cachePath, '/repo/a')).to.equal(undefined);
  });

  it('throws from readCacheSync when the cache file does not exist', () => {
    expect(() => readCacheSync(cachePath)).to.throw();
  });
});

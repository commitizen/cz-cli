import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';

import {
  getParsedJsonFromFile,
  getParsedPackageJsonFromPath,
  isFunction,
  isInTest
} from '../../src/common/util';

describe('common util', function () {

  it('isFunction determines if a function is passed', function () {

    // Truthies
    expect(isFunction(function () {})).to.be.true;
    expect(isFunction(new Function())).to.be.true;

    // Falsies
    expect(isFunction(undefined)).to.be.false;
    expect(isFunction(null)).to.be.false;
    expect(isFunction(49)).to.be.false;
    expect(isFunction([])).to.be.false;
    expect(isFunction({})).to.be.false;
    expect(isFunction("asdf")).to.be.false;
    expect(isFunction(true)).to.be.false;
    expect(isFunction(false)).to.be.false;
    expect(isFunction(Symbol('test'))).to.be.false;

  });

  describe('getParsedJsonFromFile', function () {

    let dir;

    beforeEach(function () {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cz-util-'));
    });

    afterEach(function () {
      fs.rmSync(dir, { recursive: true, force: true });
    });

    it('parses the JSON contents of a file', function () {
      fs.writeFileSync(path.join(dir, 'thing.json'), JSON.stringify({ hello: 'world' }));
      expect(getParsedJsonFromFile(dir, 'thing.json')).to.deep.equal({ hello: 'world' });
    });

    it('logs and returns undefined when the file is missing', function () {
      const errorStub = sinon.stub(console, 'error');
      try {
        expect(getParsedJsonFromFile(dir, `${uuidv4()}.json`)).to.equal(undefined);
        expect(errorStub.calledOnce).to.equal(true);
      } finally {
        errorStub.restore();
      }
    });

    it('logs and returns undefined when the file is not valid JSON', function () {
      const errorStub = sinon.stub(console, 'error');
      try {
        fs.writeFileSync(path.join(dir, 'bad.json'), 'not json {');
        expect(getParsedJsonFromFile(dir, 'bad.json')).to.equal(undefined);
        expect(errorStub.calledOnce).to.equal(true);
      } finally {
        errorStub.restore();
      }
    });

    it('getParsedPackageJsonFromPath reads package.json from a directory', function () {
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'demo', version: '9.9.9' }));
      expect(getParsedPackageJsonFromPath(dir)).to.deep.equal({ name: 'demo', version: '9.9.9' });
    });
  });

  it('isInTest is true while the mocha "it" global is present', function () {
    expect(isInTest()).to.equal(true);
  });
});

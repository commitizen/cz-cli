import { expect } from 'chai';
import { isFunction, isString } from '../../src/common/util';

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

  it('isString determines if string is passed', function () {

    // Truthies
    expect(isString('a single quoted string')).to.be.true;
    expect(isString("a double quoted string")).to.be.true;
    expect(isString(`
      a multi
      line
      string`
    )).to.be.true;
    expect(isString(new String())).to.be.true;

    // Falsies
    expect(isString(function () {})).to.be.false;
    expect(isString(undefined)).to.be.false;
    expect(isString(null)).to.be.false;
    expect(isString(49)).to.be.false;
    expect(isString([])).to.be.false;
    expect(isString({})).to.be.false;
    expect(isString(true)).to.be.false;
    expect(isString(false)).to.be.false;
    expect(isString(Symbol('test'))).to.be.false;

  });
});

import { expect } from 'chai';
import { isFunction } from '../../src/common/util';

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

});

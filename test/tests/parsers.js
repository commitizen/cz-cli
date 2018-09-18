/* eslint-env mocha */

import { expect } from 'chai';
import { parse } from '../../src/cli/parsers/git-cz';

describe('parsers', () => {
  describe('git-cz', () => {
    it('should parse --message "Hello, World!"', () => {
      expect(parse(['--amend', '--message', 'Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse --message="Hello, World!"', () => {
      expect(parse(['--amend', '--message=Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse -amwip', () => {
      expect(parse(['-amwip'])).to.deep.equal(['-a']);
    });

    it('should parse -am=wip', () => {
      expect(parse(['-am=wip'])).to.deep.equal(['-a']);
    });

    it('should parse -am wip', () => {
      expect(parse(['-am', 'wip'])).to.deep.equal(['-a']);
    });

    it('should parse -a -m wip -n', () => {
      expect(parse(['-a', '-m', 'wip', '-n'])).to.deep.equal(['-a', '-n']);
    });

    it('should parse -a -m=wip -n', () => {
      expect(parse(['-a', '-m=wip', '-n'])).to.deep.equal(['-a', '-n']);
    });
  });
});

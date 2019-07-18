import { expect } from 'chai';
import { gitCz as gitCzParser, commitizen as commitizenParser } from '../../src/cli/parsers';

describe('parsers', () => {
  describe('git-cz', () => {
    it('should parse --message "Hello, World!"', () => {
      expect(gitCzParser.parse(['--amend', '--message', 'Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse --message="Hello, World!"', () => {
      expect(gitCzParser.parse(['--amend', '--message=Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse -amwip', () => {
      expect(gitCzParser.parse(['-amwip'])).to.deep.equal(['-a']);
    });

    it('should parse -am=wip', () => {
      expect(gitCzParser.parse(['-am=wip'])).to.deep.equal(['-a']);
    });

    it('should parse -am wip', () => {
      expect(gitCzParser.parse(['-am', 'wip'])).to.deep.equal(['-a']);
    });

    it('should parse -a -m wip -n', () => {
      expect(gitCzParser.parse(['-a', '-m', 'wip', '-n'])).to.deep.equal(['-a', '-n']);
    });

    it('should parse -a -m=wip -n', () => {
      expect(gitCzParser.parse(['-a', '-m=wip', '-n'])).to.deep.equal(['-a', '-n']);
    });
  });

  describe('commitizen', () => {
    it('should parse out the --amend option', () => {
      expect(commitizenParser.parse(['--amend'])).to.deep.equal({ _: [], amend: true })
    });
    it('should parse out the --hook option', () => {
      expect(commitizenParser.parse(['--hook'])).to.deep.equal({ _: [], hook: true })
    });
  });
});

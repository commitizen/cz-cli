import { expect } from 'chai';
import proxyquire from 'proxyquire';

import {
  generateInstallAdapterCommand,
  getInstallStringMappings
} from '../../src/commitizen/adapter';

// Helper: turn the Map returned by getInstallStringMappings into the flag string
// the way generateInstallAdapterCommand does.
function flags (mappings) {
  return Array.from(mappings.values()).filter(Boolean).join(' ');
}

describe('adapter (unit)', () => {

  describe('getInstallStringMappings', () => {
    it('maps npm flags', () => {
      expect(flags(getInstallStringMappings({ saveDev: true, saveExact: true, force: true }, 'npm')))
        .to.equal('--save-dev --save-exact --force');
    });

    it('uses --save for a prod install (save without saveDev)', () => {
      expect(flags(getInstallStringMappings({ save: true, saveDev: false }, 'npm')))
        .to.equal('--save');
    });

    it('maps yarn flags', () => {
      expect(flags(getInstallStringMappings({ dev: true, exact: true, force: true }, 'yarn')))
        .to.equal('--dev --exact --force');
    });

    it('maps pnpm flags and always ignores dependency build scripts', () => {
      expect(flags(getInstallStringMappings({ saveDev: true, exact: true }, 'pnpm')))
        .to.equal('--save-dev --save-exact --ignore-scripts');
    });

    it('pnpm keys --save-exact off `exact`, not `saveExact`', () => {
      expect(flags(getInstallStringMappings({ exact: true }, 'pnpm'))).to.contain('--save-exact');
      expect(flags(getInstallStringMappings({ saveExact: true }, 'pnpm'))).to.not.contain('--save-exact');
    });

    it('falls back to the npm mapping for an unknown package manager', () => {
      expect(flags(getInstallStringMappings({ saveDev: true }, 'bun'))).to.equal('--save-dev');
    });
  });

  describe('generateInstallAdapterCommand', () => {
    it('builds an npm install command by default', () => {
      const mappings = getInstallStringMappings({ saveDev: true }, 'npm');
      expect(generateInstallAdapterCommand(mappings, 'cz-foo'))
        .to.equal('npm install cz-foo --save-dev');
    });

    it('builds a yarn add command', () => {
      const mappings = getInstallStringMappings({ dev: true }, 'yarn');
      expect(generateInstallAdapterCommand(mappings, 'cz-foo', 'yarn'))
        .to.equal('yarn add cz-foo --dev');
    });

    it('builds a pnpm add command', () => {
      const mappings = getInstallStringMappings({ saveDev: true }, 'pnpm');
      expect(generateInstallAdapterCommand(mappings, 'cz-foo', 'pnpm'))
        .to.equal('pnpm add cz-foo --save-dev --ignore-scripts');
    });

    it('falls back to "install" for an unrecognised package manager', () => {
      expect(generateInstallAdapterCommand(new Map(), 'cz-foo', 'bun').trim())
        .to.equal('bun install cz-foo');
    });
  });

  describe('addPathToAdapterConfig', () => {
    function run (packageJsonString, adapterNpmName) {
      let written;
      const { addPathToAdapterConfig } = proxyquire('../../src/commitizen/adapter', {
        'find-node-modules': () => ['node_modules'],
        fs: {
          readFileSync: () => packageJsonString,
          writeFileSync: (_p, contents) => { written = contents; }
        }
      });
      addPathToAdapterConfig('/cli', '/repo', adapterNpmName);
      return written;
    }

    it('adds config.commitizen.path, preserving the detected indentation', () => {
      const written = run('{\n\t"name": "x"\n}\n', 'cz-foo');
      expect(written).to.equal(
        '{\n\t"name": "x",\n\t"config": {\n\t\t"commitizen": {\n\t\t\t"path": "./node_modules/cz-foo"\n\t\t}\n\t}\n}\n'
      );
    });

    it('falls back to a two-space indent when none can be detected', () => {
      const written = run('{"name":"x"}', 'cz-foo');
      expect(written).to.equal(
        '{\n  "name": "x",\n  "config": {\n    "commitizen": {\n      "path": "./node_modules/cz-foo"\n    }\n  }\n}\n'
      );
    });

    it('does not merge when config.commitizen.path already matches the adapter name', () => {
      // Current behaviour: the guard compares against the bare npm name (not the
      // "./node_modules/<name>" form), and when it matches nothing is merged so
      // an empty string is serialised. Locked in here to catch a regression.
      const written = run('{"config":{"commitizen":{"path":"cz-foo"}}}', 'cz-foo');
      expect(written).to.equal('""\n');
    });
  });
});

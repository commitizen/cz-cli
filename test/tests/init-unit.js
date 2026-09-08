import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('commitizen init (unit)', () => {

  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cz-init-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('throws when the repo path or adapter name is missing', () => {
    const init = proxyquire('../../src/commitizen/init', {
      child_process: { execSync: sinon.stub() }
    }).default;

    expect(() => init()).to.throw(/Path is required/);
    expect(() => init(dir)).to.throw(/adapter's npm name is required/);
  });

  it('swallows and logs an install failure instead of throwing', () => {
    const errorStub = sinon.stub(console, 'error');
    try {
      const execSync = sinon.stub().throws(new Error('EACCES: install failed'));
      const init = proxyquire('../../src/commitizen/init', {
        child_process: { execSync }
      }).default;

      expect(() => init(dir, 'cz-foo', {})).to.not.throw();
      expect(execSync.called).to.equal(true);
      expect(errorStub.calledOnce).to.equal(true);
      expect(errorStub.args[0][0]).to.be.instanceOf(Error);
    } finally {
      errorStub.restore();
    }
  });

  it('also installs commitizen when includeCommitizen is set', () => {
    const execSync = sinon.stub();
    const addPathToAdapterConfig = sinon.stub();
    const init = proxyquire('../../src/commitizen/init', {
      child_process: { execSync },
      './adapter': {
        addPathToAdapterConfig,
        getInstallStringMappings: () => new Map(),
        generateInstallAdapterCommand: (m, name, pm) => `${pm} add ${name}`
      }
    }).default;

    init(dir, 'cz-foo', { includeCommitizen: true });

    const commands = execSync.args.map((a) => a[0]);
    expect(commands.some((c) => c.includes('cz-foo'))).to.equal(true);
    expect(commands.some((c) => c.includes('commitizen'))).to.equal(true);
    expect(addPathToAdapterConfig.calledWith(sinon.match.string, dir, 'cz-foo')).to.equal(true);
  });
});

import { expect } from 'chai';
import semver from 'semver';

// TODO: augment these tests with tests using the actual cli call
// For now we're just using the library, which is probably fine
// in the short term
import { init as commitizenInit } from '../../src/commitizen';

// Bootstrap our tester
import { bootstrap } from '../tester';

// Destructure some things based on the bootstrap process
let { config, repo, clean, util } = bootstrap();

before(function () {
  // Creates the temp path
  clean.before(config.paths.tmp);
});

beforeEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  repo.createEndUser(config.paths.endUserRepo);
});

describe('init', function () {

  it('installs an adapter with --save-dev', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog');

    // TEST

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).to.have.nested.property('devDependencies.cz-conventional-changelog');

  });

  it('installs an adapter with --save', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { save: true, saveDev: false });

    // TEST

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).to.have.nested.property('dependencies.cz-conventional-changelog');

  });

  it('errors on previously installed adapter', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { saveDev: true });

    // TEST
    // Adding a second adapter
    expect(function () {
      commitizenInit(config.paths.endUserRepo, 'cz-jira-smart-commit', { saveDev: true });
    }).to.throw(/already configured/);

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).not.to.have.nested.property('devDependencies', 'cz-jira-smart-commit');
    expect(packageJson).to.have.nested.property('config.commitizen.path', './node_modules/cz-conventional-changelog');
    // TODO: Eventually may need to offer both path and package keys. package = npm package name
    // Path for local development
  });

  it('succeeds if force is true', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { saveDev: true });

    // TEST

    // Adding a second adapter
    expect(function () {
      commitizenInit(config.paths.endUserRepo, 'cz-jira-smart-commit', { saveDev: true, force: true });
    }).to.not.throw();

    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson.devDependencies).to.have.property('cz-jira-smart-commit');
    expect(packageJson).to.have.nested.property('config.commitizen.path', './node_modules/cz-jira-smart-commit');

  });

  it('installs an adapter without --save-exact', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog');
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);

    // TEST
    expect(packageJson.devDependencies).to.have.property('cz-conventional-changelog');
    let range = packageJson.devDependencies['cz-conventional-changelog'];

    // It should satisfy the requirements of a range
    expect(semver.validRange(range)).to.not.equal(null);

    // // But you CAN NOT increment a range
    // expect(semver.inc(range, 'major')).to.equal(null);
    // TODO: We need to figure out how to check if the repo has save exact set
    // in the config before we can re-enable this. The --save-exact setting
    // in our package.json breaks this test

  });

  it('installs an adapter with --save-exact', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { saveExact: true });
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);

    // TEST
    expect(packageJson.devDependencies).to.have.property('cz-conventional-changelog');
    let range = packageJson.devDependencies['cz-conventional-changelog'];

    // It should satisfy the requirements of a range
    expect(semver.validRange(range)).to.not.equal(null);

    // But you CAN increment a single version
    expect(semver.inc(range, 'major')).not.to.equal(null);

  });

  it('installs an commitizen with includeCommitizen', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { includeCommitizen: true });
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);

    // TEST
    expect(packageJson.devDependencies).to.have.property('cz-conventional-changelog');
    expect(packageJson.devDependencies).to.have.property('commitizen');
    let range = packageJson.devDependencies['cz-conventional-changelog'];

    // It should satisfy the requirements of a range
    expect(semver.validRange(range)).to.not.equal(null);

    // But you CAN increment a single version
    expect(semver.inc(range, 'major')).not.to.equal(null);

  });

  it('installs an adapter with --yarn', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true });

    // TEST

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).to.have.nested.property('dependencies.cz-conventional-changelog');

  });

  it('installs an adapter with --yarn --dev', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Install an adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true, dev: true });

    // TEST

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).to.have.nested.property('devDependencies.cz-conventional-changelog');

  });

  it('errors (with --yarn) on previously installed adapter', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true, dev: true });

    // TEST
    // Adding a second adapter
    expect(function () {
      commitizenInit(config.paths.endUserRepo, 'cz-jira-smart-commit', { yarn: true, dev: true });
    }).to.throw(/already configured/);

    // Check resulting json
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson).not.to.have.nested.property('devDependencies', 'cz-jira-smart-commit');
    expect(packageJson).to.have.nested.property('config.commitizen.path', './node_modules/cz-conventional-changelog');
    // TODO: Eventually may need to offer both path and package keys. package = npm package name
    // Path for local development
  });

  it('succeeds (with --yarn) if force is true', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true, dev: true });

    // TEST

    // Adding a second adapter
    expect(function () {
      commitizenInit(config.paths.endUserRepo, 'cz-jira-smart-commit', { yarn: true, dev: true, force: true });
    }).to.not.throw();

    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);
    expect(packageJson.devDependencies).to.have.property('cz-jira-smart-commit');
    expect(packageJson).to.have.nested.property('config.commitizen.path', './node_modules/cz-jira-smart-commit');

  });

  it('installs (with --yarn) an adapter without --save-exact', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true, dev: true });
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);

    // TEST
    expect(packageJson.devDependencies).to.have.property('cz-conventional-changelog');
    let range = packageJson.devDependencies['cz-conventional-changelog'];

    // It should satisfy the requirements of a range
    expect(semver.validRange(range)).to.not.equal(null);

    // // But you CAN NOT increment a range
    // expect(semver.inc(range, 'major')).to.equal(null);
    // TODO: We need to figure out how to check if the repo has save exact set
    // in the config before we can re-enable this. The --save-exact setting
    // in our package.json breaks this test

  });

  it('installs an adapter with --yarn --exact', function () {

    this.timeout(config.maxTimeout); // this could take a while

    // SETUP

    // Add a first adapter
    commitizenInit(config.paths.endUserRepo, 'cz-conventional-changelog', { yarn: true, dev: true, exact: true });
    let packageJson = util.getParsedPackageJsonFromPath(config.paths.endUserRepo);

    // TEST
    expect(packageJson.devDependencies).to.have.property('cz-conventional-changelog');
    let range = packageJson.devDependencies['cz-conventional-changelog'];

    // It should satisfy the requirements of a range
    expect(semver.validRange(range)).to.not.equal(null);

    // But you CAN increment a single version
    expect(semver.inc(range, 'major')).not.to.equal(null);

  });

});

afterEach(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // All this should do is archive the tmp path to the artifacts
  clean.afterEach(config.paths.tmp, config.preserve);
});

after(function () {
  this.timeout(config.maxTimeout); // this could take a while
  // Once everything is done, the artifacts should be cleaned up based on
  // the preserve setting in the config
  clean.after(config.paths.tmp, config.preserve);
});

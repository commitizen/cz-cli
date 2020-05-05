import path from 'path';

/**
 * Modify the testConfig to your liking
 */
let config = {
  paths: {
    /**
     * Where to place the artifacts for the last test run.
     * These are cleared at the beginning of the next test
     * run.
     */
    tmp: path.join(__dirname, '/.tmp'),

    /**
     * Where to temporarily store the artifacts for the end
     * user repo.
     */
    endUserRepo: path.join(__dirname, '/.tmp/enduser-app')
  },

  /**
   * This should be set to a large enough timeout that it is
   * longer than the longest test.
   *
   * Usage (in a given test):
   *   this.timeout = config.maxTimeout;
   *
   * Note that only certain long tests should use this
   * max timeout value (such as installing packages).
   *
   * Most tests should use the default timeout.
   */
  maxTimeout: 240000,

  /**
   * Whether or not to keep the artifacts of the tests after
   * they've run.
   *
   * Possible options:
   *    Positive integer    Keeps latests (n) run artifacts
   *    false (default)     Keeps no artifacts
   *    true | 'all'        Keeps all artifacts, Warning. See below.
   *
   * Artifacts are stored in test/artifacts.
   *
   * Each run of the test suite is given a unique id and each
   * test is given a unique id.
   *
   * WARNING:
   * 'all' or true may be useful for debugging but you should have
   * the value set to false or a positive integer by default as the
   * artifacts folder will continue to grow unless you manually clear
   * it. Use at your own risk.
   */
  preserve: 1
};

export { config };

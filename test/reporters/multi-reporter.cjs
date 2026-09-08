'use strict';

const Mocha = require('mocha');

const { Spec, XUnit } = Mocha.reporters;

// Hand-rolled replacement for `mocha-multi-reporters` + `mocha-junit-reporter`,
// both of which throw "Class constructor Base cannot be invoked without 'new'"
// on Mocha >= 11 (they call `Base.call(this)` on what is now an ES class).
//
// Runs the console `spec` reporter and the built-in `xunit` reporter off a
// single test pass. `xunit` emits JUnit-compatible XML; point it at a file with
//   mocha --reporter ./test/reporters/multi-reporter.cjs \
//         --reporter-option output=./junit-testresults.xml
class MultiReporter extends Mocha.reporters.Base {
  constructor(runner, options) {
    super(runner, options);

    // Each sub-reporter attaches its own listeners to the shared runner.
    this.reporters = [Spec, XUnit].map(
      (Reporter) => new Reporter(runner, options)
    );
  }

  // Mocha only calls `done()` on the top-level reporter, so fan it out to any
  // sub-reporter that needs it (xunit uses it to flush its output file stream).
  done(failures, fn) {
    const pending = this.reporters.filter((r) => typeof r.done === 'function');

    if (pending.length === 0) {
      return fn(failures);
    }

    let remaining = pending.length;
    pending.forEach((reporter) => {
      reporter.done(failures, () => {
        remaining -= 1;
        if (remaining === 0) {
          fn(failures);
        }
      });
    });
  }
}

module.exports = MultiReporter;

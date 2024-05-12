var { Builder } = require('./builder');
var { TestSuites } = require('./test_suites');
var { TestSuite } = require('./test_suite');
var { TestCase } = require('./test_case');

class Factory {
  /**
   * @returns {import('./builder').Builder}
   */
  newBuilder() {
    return new Builder(this);
  }

  /**
   * @returns {import('./test_suite').TestSuite}
   */
  newTestSuite() {
    return new TestSuite(this);
  }

  /**
   * @returns {import('./test_case').TestCase}
   */
  newTestCase() {
    return new TestCase(this);
  }

  /**
   * @returns {import('./test_suites').TestSuites}
   */
  newTestSuites() {
    return new TestSuites(this);
  }
}

module.exports = { Factory: Factory };

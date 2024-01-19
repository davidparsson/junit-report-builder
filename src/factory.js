var Builder = require('./builder');
var TestSuite = require('./test_suite');
var TestCase = require('./test_case');

class Factory {
  constructor() {}

  /**
   * @returns {Builder}
   */
  newBuilder() {
    return new Builder(this);
  }

  /**
   * @returns {TestSuite}
   */
  newTestSuite() {
    return new TestSuite(this);
  }

  /**
   * @returns {TestCase}
   */
  newTestCase() {
    return new TestCase(this);
  }
}

module.exports = Factory;

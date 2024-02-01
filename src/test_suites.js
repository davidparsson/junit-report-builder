// @ts-check
var { TestGroup } = require('./test_group');

class TestSuites extends TestGroup {
  /**
   * @param {import('./factory').Factory} factory
   */
  constructor(factory) {
    super(factory, 'testsuites');
  }

  /**
   * @returns {import('./test_suite').TestSuite}
   */
  testSuite() {
    var suite = this._factory.newTestSuite();
    this._children.push(suite);
    return suite;
  }
}

module.exports = { TestSuites: TestSuites };

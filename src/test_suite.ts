// @ts-check
var _ = require('lodash');
var { TestGroup } = require('./test_group');

class TestSuite extends TestGroup {
  /**
   * @param {import('./factory').Factory} factory
   */
  constructor(factory) {
    super(factory, 'testsuite');
  }
}

module.exports = { TestSuite: TestSuite };

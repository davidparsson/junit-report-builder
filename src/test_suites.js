// @ts-check
var xmlBuilder = require('xmlbuilder');
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

  /**
   * @protected
   * @returns {import('xmlbuilder').XMLElement}
   */
  createElement() {
    const node = xmlBuilder.create('testsuites', { encoding: 'UTF-8', invalidCharReplacement: '' });
    Object.keys(this._attributes).forEach((key) => {
      node.att(key, this._attributes[key]);
    });
    return node;
  }
}

module.exports = { TestSuites: TestSuites };

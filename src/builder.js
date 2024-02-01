// @ts-check
var path = require('path');
var makeDir = require('make-dir');
var fs = require('fs');
var { TestSuites } = require('./test_suites');

class JUnitReportBuilder {
  /**
   * @param {import('./factory').Factory} factory
   */
  constructor(factory) {
    this._factory = factory;
    this._rootTestSuites = new TestSuites(factory);
  }

  /**
   * @param {string} reportPath
   */
  writeTo(reportPath) {
    makeDir.sync(path.dirname(reportPath));
    fs.writeFileSync(reportPath, this.build(), 'utf8');
  }

  /**
   * @returns {string}
   */
  build() {
    var xmlTree = this._rootTestSuites.build();
    return xmlTree.end({ pretty: true });
  }

  /**
   * @param {string} name
   * @returns {JUnitReportBuilder}
   * @chainable
   */
  name(name) {
    this._rootTestSuites.name(name);
    return this;
  }

  /**
   * @returns {import('./test_suite').TestSuite}
   */
  testSuite() {
    return this._rootTestSuites.testSuite();
  }

  /**
   * @returns {import('./test_case').TestCase}
   */
  testCase() {
    return this._rootTestSuites.testCase();
  }

  /**
   * @returns {JUnitReportBuilder}
   */
  newBuilder() {
    return this._factory.newBuilder();
  }
}

module.exports = { Builder: JUnitReportBuilder };

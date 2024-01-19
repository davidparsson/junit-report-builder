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
   * @returns {import('./test_suites').TestSuites}
   */
  testSuites() {
    return this._rootTestSuites;
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
    return new JUnitReportBuilder(this._factory);
  }
}

module.exports = { Builder: JUnitReportBuilder };

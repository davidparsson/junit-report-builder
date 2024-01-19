// @ts-check
var _ = require('lodash');
var xmlBuilder = require('xmlbuilder');
var path = require('path');
var makeDir = require('make-dir');
var fs = require('fs');
var TestSuite = require('./test_suite');
var TestCase = require('./test_case');

class JUnitReportBuilder {
  /**
   * @param {import('./factory')} factory
   */
  constructor(factory) {
    this._factory = factory;
    this._testSuitesAndCases = [];
  }

  /**
   * @param {string} reportPath
   */
  writeTo(reportPath) {
    makeDir.sync(path.dirname(reportPath));
    fs.writeFileSync(reportPath, this.build(), 'utf8');
  }

  /**
   * @returns {string} xml file content
   */
  build() {
    var xmlTree = xmlBuilder.create('testsuites', { encoding: 'UTF-8', invalidCharReplacement: '' });
    _.forEach(this._testSuitesAndCases, function (suiteOrCase) {
      suiteOrCase.build(xmlTree);
    });
    return xmlTree.end({ pretty: true });
  }

  /**
   * @returns {import('./test_suite')}
   */
  testSuite() {
    var suite = this._factory.newTestSuite();
    this._testSuitesAndCases.push(suite);
    return suite;
  }

  /**
   * @returns {import('./test_case')}
   */
  testCase() {
    var testCase = this._factory.newTestCase();
    this._testSuitesAndCases.push(testCase);
    return testCase;
  }

  /**
   * @returns {ReturnType<import('./factory')['newBuilder']>}
   */
  newBuilder() {
    return this._factory.newBuilder();
  }
}

module.exports = JUnitReportBuilder;

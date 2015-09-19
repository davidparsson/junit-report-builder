var _ = require('lodash');
var xmlBuilder = require('xmlbuilder');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var TestSuite = require('./test_suite');
var TestCase = require('./test_case');

/**
A builder. The entry-point.
@class
*/
function JUnitReportBuilder(factory) {
  this._factory = factory;
  this._testSuitesAndCases = [];
}

/**
Builds and writes the report to a file.
@param {string} reportPath
*/
JUnitReportBuilder.prototype.writeTo = function (reportPath) {
  mkdirp.sync(path.dirname(reportPath));
  fs.writeFileSync(reportPath, this.build(), 'utf8');
};

/**
Builds the XML for this report.
@private
@return {string}
*/
JUnitReportBuilder.prototype.build = function () {
  var xmlTree = xmlBuilder.create('testsuites', { encoding: 'UTF-8' });
  _.forEach(this._testSuitesAndCases, function (suiteOrCase) {
    suiteOrCase.build(xmlTree);
  });
  return xmlTree.end({ pretty: true });
};

/**
Adds a test suite to this report.
@return {TestSuite}
*/
JUnitReportBuilder.prototype.testSuite = function () {
  var suite = this._factory.newTestSuite();
  this._testSuitesAndCases.push(suite);
  return suite;
};

/**
Adds a test case without a test suite to this report.
@return {TestCase}
*/
JUnitReportBuilder.prototype.testCase = function () {
  var testCase = this._factory.newTestCase();
  this._testSuitesAndCases.push(testCase);
  return testCase;
};

/**
Returns a new builder instance, for creating a separate report.
@return {JUnitReportBuilder}
*/
JUnitReportBuilder.prototype.newBuilder = function () {
  return this._factory.newBuilder();
};

module.exports = JUnitReportBuilder;

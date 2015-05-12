var _ = require('lodash');
var xmlBuilder = require('xmlbuilder');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var TestSuite = require('./test_suite');
var TestCase = require('./test_case');

function JUnitReportBuilder() {
  this._testSuitesAndCases = [];
}

JUnitReportBuilder.prototype.writeTo = function (reportPath) {
  mkdirp.sync(path.dirname(reportPath));
  fs.writeFileSync(reportPath, this.build(), 'utf8');
};

JUnitReportBuilder.prototype.build = function () {
  var xmlTree = xmlBuilder.create('testsuites');
  _.forEach(this._testSuitesAndCases, function (suiteOrCase) {
    suiteOrCase.build(xmlTree);
  });
  return xmlTree.end({ pretty: true });
};

JUnitReportBuilder.prototype.testSuite = function (name) {
  var suite = new TestSuite(name);
  this._testSuitesAndCases.push(suite);
  return suite;
};

JUnitReportBuilder.prototype.testCase = function (className, name) {
  var testCase = new TestCase(className, name);
  this._testSuitesAndCases.push(testCase);
  return testCase;
};

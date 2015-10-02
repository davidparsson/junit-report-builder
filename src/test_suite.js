var _ = require('lodash');
var dateformat = require('dateformat');

function TestSuite(factory) {
  this._factory = factory;
  this._attributes = {};
  this._testCases = [];
  this._properties = [];
}

TestSuite.prototype.name = function (name) {
  this._attributes.name = name;
  return this;
};

TestSuite.prototype.timestamp = function (timestamp) {
  if(_.isDate(timestamp)) timestamp = dateformat(timestamp, "yyyy-mm-dd'T'HH:MM:ss");
  this._attributes.timestamp = timestamp;
  return this;
};

TestSuite.prototype.time = function (time) {
  this._attributes.time = time;
  return this;
};

TestSuite.prototype.tests = function (tests) {
  this._attributes.tests = tests;
  return this;
};

TestSuite.prototype.testsAdd = function (num) {
  this._attributes.tests = this._attributes.tests || 0;
  this._attributes.tests += num || 1;
  return this;
};

TestSuite.prototype.errors = function (errors) {
  this._attributes.errors = errors;
  return this;
};

TestSuite.prototype.errorsAdd = function (num) {
  this._attributes.errors  = this._attributes.errors || 0;
  this._attributes.errors += num || 1;
  return this;
};

TestSuite.prototype.failures = function (failures) {
  this._attributes.failures = failures;
  return this;
};

TestSuite.prototype.failuresAdd = function (num) {
  this._attributes.failures  = this._attributes.failures || 0;
  this._attributes.failures += num || 1;
  return this;
};

TestSuite.prototype.skipped = function (skipped) {
  this._attributes.skipped = skipped;
  return this;
};

TestSuite.prototype.skippedAdd = function (num) {
  this._attributes.skipped  = this._attributes.skipped || 0;
  this._attributes.skipped += num || 1;
  return this;
};

TestSuite.prototype.property = function (name, value) {
  this._properties.push({'name': name, 'value': value});
  return this;
};

TestSuite.prototype.testCase = function () {
  var testCase = this._factory.newTestCase();
  this._testCases.push(testCase);
  return testCase;
};

TestSuite.prototype.build = function (parentElement) {
  var suiteElement = parentElement.ele('testsuite', this._attributes);

  if (this._properties.length) {
    var propertiesElement = suiteElement.ele('properties');
    _.forEach(this._properties, function (property) {
      propertiesElement.ele('property', {
        name: property.name,
        value: property.value
      });
    });
  }


  _.forEach(this._testCases, function (testCase) {
    testCase.build(suiteElement);
  });
};

module.exports = TestSuite;
// vim:sw=2:sts=2:ts=2:et

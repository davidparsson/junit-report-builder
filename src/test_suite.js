var TestCase = require('./test_case');
var _ = require('lodash');

function TestSuite() {
  this._attributes = {};
  this._testCases = [];
  this._properties = [];
}

TestSuite.prototype.name = function (name) {
  this._attributes.name = name;
  return this;
};

TestSuite.prototype.property = function (name, value) {
  this._properties.push({'name': name, 'value': value});
  return this;
};

TestSuite.prototype.testCase = function (className, name) {
  var testCase = new TestCase(className, name);
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

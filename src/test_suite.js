var TestCase = require('./TestCase');

function TestSuite(name) {
  this._name = name;
  this._testCases = [];
  this._properties = [];
}

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
  var suiteElement = parentElement.ele('testsuite', {
    name: this._name
  });

  _.forEach(this._properties, function (property) {
    suiteElement.ele('property', {
      name: property.name,
      value: property.value
    });
  });

  _.forEach(this._testCases, function (testCase) {
    testCase.build(suiteElement);
  });
};

module.exports = TestSuite;

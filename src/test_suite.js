var _ = require('lodash');

/**
Represents a test suite. Will result in a single `<testsuite>` element. May contain {@TestCase}
@class
*/
function TestSuite(factory) {
  this._factory = factory;
  this._attributes = {};
  this._testCases = [];
  this._properties = [];
}

/**
Sets the name of this test suite.
@param {string} name
@return {TestSuite}
*/
TestSuite.prototype.name = function (name) {
  this._attributes.name = name;
  return this;
};

/**
Adds a property element to this suite.
@param {string} name
@param {string} value
@return {TestSuite}
*/
TestSuite.prototype.property = function (name, value) {
  this._properties.push({'name': name, 'value': value});
  return this;
};

/**
Adds a test case to this suite.
@return {TestCase}
*/
TestSuite.prototype.testCase = function () {
  var testCase = this._factory.newTestCase();
  this._testCases.push(testCase);
  return testCase;
};


/**
Builds and adds this subtree's XML to its parent element.
@private
@param {parentElement}
*/
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

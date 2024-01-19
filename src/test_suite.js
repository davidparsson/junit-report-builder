// @ts-check
var _ = require('lodash');
var formatDate = require('date-format').asString;

class TestSuite {
  /**
   * @param {import('./factory')} factory
   */
  constructor(factory) {
    this._factory = factory;
    this._attributes = {};
    this._testCases = [];
    this._properties = [];
  }

  /**
   * @param {string} name
   * @chainable
   */
  name(name) {
    this._attributes.name = name;
    return this;
  }

  /**
   * @param {number} timeInSeconds
   * @chainable
   */
  time(timeInSeconds) {
    this._attributes.time = timeInSeconds;
    return this;
  }

  /**
   * @param {Date|string} timestamp
   * @chainable
   */
  timestamp(timestamp) {
    if (_.isDate(timestamp)) {
      this._attributes.timestamp = formatDate('yyyy-MM-ddThh:mm:ss', timestamp);
    } else {
      this._attributes.timestamp = timestamp;
    }
    return this;
  }

  /**
   * @param {string} name
   * @param {string} value
   * @chainable
   */
  property(name, value) {
    this._properties.push({ name: name, value: value });
    return this;
  }

  /**
   * @returns {import('./test_case')}
   */
  testCase() {
    var testCase = this._factory.newTestCase();
    this._testCases.push(testCase);
    return testCase;
  }

  /**
   * @returns {number}
   */
  getFailureCount() {
    return this._sumTestCaseCounts(function (testCase) {
      return testCase.getFailureCount();
    });
  }

  /**
   * @returns {number}
   */
  getErrorCount() {
    return this._sumTestCaseCounts(function (testCase) {
      return testCase.getErrorCount();
    });
  }

  /**
   * @returns {number}
   */
  getSkippedCount() {
    return this._sumTestCaseCounts(function (testCase) {
      return testCase.getSkippedCount();
    });
  }

  /**
   * @param {(testCase: import('./test_case')) => number} counterFunction
   * @returns {number}
   */
  _sumTestCaseCounts(counterFunction) {
    var counts = _.map(this._testCases, counterFunction);
    return _.sum(counts);
  }

  /**
   * @param {import('xmlbuilder').XMLElement} parentElement
   */
  build(parentElement) {
    this._attributes.tests = this._testCases.length;
    this._attributes.failures = this.getFailureCount();
    this._attributes.errors = this.getErrorCount();
    this._attributes.skipped = this.getSkippedCount();
    var suiteElement = parentElement.ele('testsuite', this._attributes);

    if (this._properties.length) {
      var propertiesElement = suiteElement.ele('properties');
      _.forEach(this._properties, function (property) {
        propertiesElement.ele('property', {
          name: property.name,
          value: property.value,
        });
      });
    }

    _.forEach(this._testCases, function (testCase) {
      testCase.build(suiteElement);
    });
  }
}

module.exports = TestSuite;

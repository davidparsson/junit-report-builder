// @ts-check
var _ = require('lodash');
var formatDate = require('date-format').asString;
var { TestNode } = require('./test_node');

class TestGroup extends TestNode {
  /**
   * @param {import('./factory').Factory} factory
   * @param {string} elementName
   */
  constructor(factory, elementName) {
    super(factory, elementName);
    this._children = [];
  }

  /**
   * @param {string|Date} timestamp
   * @returns {TestGroup}
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
   * @returns {import('./test_case').TestCase}
   */
  testCase() {
    var testCase = this._factory.newTestCase();
    this._children.push(testCase);
    return testCase;
  }

  /**
   * @returns {number}
   */
  getTestCaseCount() {
    return this._sumTestCaseCounts(function (testCase) {
      return testCase.getTestCaseCount();
    });
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
   * @protected
   * @param {Function} counterFunction
   * @returns {number}
   */
  _sumTestCaseCounts(counterFunction) {
    var counts = _.map(this._children, counterFunction);
    return _.sum(counts);
  }

  /**
   * @param {import('xmlbuilder').XMLElement} [parentElement]
   * @returns {import('xmlbuilder').XMLElement}
   */
  build(parentElement) {
    this._attributes.tests = this.getTestCaseCount();
    this._attributes.failures = this.getFailureCount();
    this._attributes.errors = this.getErrorCount();
    this._attributes.skipped = this.getSkippedCount();
    return super.build(parentElement);
  }

  /**
   * @protected
   * @param {import('xmlbuilder').XMLElement} element
   * @returns {import('xmlbuilder').XMLElement}
   */
  buildNode(element) {
    element = super.buildNode(element);
    _.forEach(this._children, function (child) {
      child.build(element);
    });
    return element;
  }
}

module.exports = { TestGroup: TestGroup };

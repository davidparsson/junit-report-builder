// @ts-check
var _ = require('lodash');

class TestNode {
  /**
   * @param {import('./factory').Factory} factory
   * @param {string} nodeName
   */
  constructor(factory, nodeName) {
    this._factory = factory;
    this._nodeName = nodeName;
    this._attributes = {};
    this._properties = [];
    this._children = [];
  }

  /**
   * @param {string} name
   * @param {string} value
   * @returns {TestNode}
   * @chainable
   */
  property(name, value) {
    this._properties.push({ name: name, value: value });
    return this;
  }

  /**
   * @param {string} className
   * @returns {TestNode}
   * @chainable
   */
  className(className) {
    this._attributes.classname = className;
    return this;
  }

  /**
   * @param {string} name
   * @returns {TestNode}
   * @chainable
   */
  name(name) {
    this._attributes.name = name;
    return this;
  }

  /**
   * @param {string} timeInSeconds
   * @returns {TestNode}
   * @chainable
   */
  time(timeInSeconds) {
    this._attributes.time = timeInSeconds;
    return this;
  }

  /**
   * @protected
   * @param {import('xmlbuilder').XMLElement} parentElement
   * @returns {import('xmlbuilder').XMLElement}
   */
  createNode(parentElement) {
    return parentElement.ele(this._nodeName, this._attributes);
  }

  /**
   * @protected
   * @param {import('xmlbuilder').XMLElement} element
   * @returns {import('xmlbuilder').XMLElement}
   */
  buildNode(element) {
    if (this._properties.length) {
      var propertiesElement = element.ele('properties');
      _.forEach(this._properties, function (property) {
        propertiesElement.ele('property', {
          name: property.name,
          value: property.value,
        });
      });
    }
    _.forEach(this._children, function (child) {
      child.build(element);
    });
    return element;
  }

  /**
   * @returns {number}
   */
  getTestCaseCount() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {number}
   */
  getFailureCount() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {number}
   */
  getErrorCount() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {number}
   */
  getSkippedCount() {
    throw new Error('Not implemented');
  }

  /**
   * @param {import('xmlbuilder').XMLElement} parentElement
   */
  build(parentElement) {
    return this.buildNode(this.createNode(parentElement));
  }
}

module.exports = { TestNode: TestNode };

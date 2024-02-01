// @ts-check
var _ = require('lodash');
var xmlBuilder = require('xmlbuilder');

class TestNode {
  /**
   * @param {import('./factory').Factory} factory
   * @param {string} elementName
   */
  constructor(factory, elementName) {
    this._factory = factory;
    this._elementName = elementName;
    this._attributes = {};
    this._properties = [];
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
   * @param {import('xmlbuilder').XMLElement} [parentElement]
   */
  build(parentElement) {
    return this.buildNode(this.createElement(parentElement));
  }

  /**
   * @protected
   * @param {import('xmlbuilder').XMLElement} [parentElement]
   * @returns {import('xmlbuilder').XMLElement}
   */
  createElement(parentElement) {
    if (parentElement) {
      return parentElement.ele(this._elementName, this._attributes);
    }
    return this.createRootElement();
  }

  /**
   * @private
   * @returns {import('xmlbuilder').XMLElement}
   */
  createRootElement() {
    const element = xmlBuilder.create(this._elementName, { encoding: 'UTF-8', invalidCharReplacement: '' });
    Object.keys(this._attributes).forEach((key) => {
      element.att(key, this._attributes[key]);
    });
    return element;
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
    return element;
  }
}

module.exports = { TestNode: TestNode };

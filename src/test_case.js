// @ts-check
var _ = require('lodash');
class TestCase {
  constructor() {
    this._error = false;
    this._failure = false;
    this._skipped = false;
    this._standardOutput = undefined;
    this._standardError = undefined;
    this._stacktrace = undefined;
    this._attributes = {};
    this._errorAttributes = {};
    this._failureAttributes = {};
    this._errorAttachment = undefined;
    this._errorContent = undefined;
    this._properties = [];
  }

  /**
   * @param {string} className
   * @chainable
   */
  className(className) {
    this._attributes.classname = className;
    return this;
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
   * @param {string} filepath
   * @chainable
   */
  file(filepath) {
    this._attributes.file = filepath;
    return this;
  }

  /**
   * @param {string} message
   * @param {string} type
   * @chainable
   */
  failure(message, type) {
    this._failure = true;
    if (message) {
      this._failureAttributes.message = message;
    }
    if (type) {
      this._failureAttributes.type = type;
    }
    return this;
  }

  /**
   * @param {string} message
   * @param {string} type
   * @param {string} content
   * @chainable
   */
  error(message, type, content) {
    this._error = true;
    if (message) {
      this._errorAttributes.message = message;
    }
    if (type) {
      this._errorAttributes.type = type;
    }
    if (content) {
      this._errorContent = content;
    }
    return this;
  }

  /**
   * @param {string} stacktrace
   * @chainable
   */
  stacktrace(stacktrace) {
    this._failure = true;
    this._stacktrace = stacktrace;
    return this;
  }

  /**
   * @chainable
   */
  skipped() {
    this._skipped = true;
    return this;
  }

  /**
   * @param {string} log
   * @chainable
   */
  standardOutput(log) {
    this._standardOutput = log;
    return this;
  }

  /**
   * @param {string} log
   * @chainable
   */
  standardError(log) {
    this._standardError = log;
    return this;
  }

  /**
   * @returns {number}
   */
  getFailureCount() {
    return Number(this._failure);
  }

  /**
   * @returns {number}
   */
  getErrorCount() {
    return Number(this._error);
  }

  /**
   * @returns {number}
   */
  getSkippedCount() {
    return Number(this._skipped);
  }

  /**
   * @param {string} path
   * @chainable
   */
  errorAttachment(path) {
    this._errorAttachment = path;
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
   * @param {import('xmlbuilder').XMLElement} parentElement
   */
  build(parentElement) {
    var testCaseElement = parentElement.ele('testcase', this._attributes);
    if (this._properties.length) {
      var propertiesElement = testCaseElement.ele('properties');
      _.forEach(this._properties, function (property) {
        propertiesElement.ele('property', {
          name: property.name,
          value: property.value,
        });
      });
    }
    if (this._failure) {
      var failureElement = testCaseElement.ele('failure', this._failureAttributes);
      if (this._stacktrace) {
        failureElement.cdata(this._stacktrace);
      }
    }
    if (this._error) {
      var errorElement = testCaseElement.ele('error', this._errorAttributes);
      if (this._errorContent) {
        errorElement.cdata(this._errorContent);
      }
    }
    if (this._skipped) {
      testCaseElement.ele('skipped');
    }
    if (this._standardOutput) {
      testCaseElement.ele('system-out').cdata(this._standardOutput);
    }
    var systemError;
    if (this._standardError) {
      systemError = testCaseElement.ele('system-err').cdata(this._standardError);

      if (this._errorAttachment) {
        systemError.txt('[[ATTACHMENT|' + this._errorAttachment + ']]');
      }
    }
  }
}

module.exports = TestCase;

// @ts-check
var _ = require('lodash');
var { TestNode } = require('./test_node');

class TestCase extends TestNode {
  /**
   * @param {import('./factory').Factory} factory
   */
  constructor(factory) {
    super(factory, 'testcase');
    this._error = false;
    this._failure = false;
    this._skipped = false;
    this._standardOutput = undefined;
    this._standardError = undefined;
    this._stacktrace = undefined;
    this._errorAttributes = {};
    this._failureAttributes = {};
    this._errorAttachment = undefined;
    this._errorContent = undefined;
  }

  /**
   * @param {string} className
   * @returns {TestCase}
   * @chainable
   */
  className(className) {
    this._attributes.classname = className;
    return this;
  }

  /**
   * @param {string} filepath
   * @returns {TestCase}
   * @chainable
   */
  file(filepath) {
    this._attributes.file = filepath;
    return this;
  }

  /**
   * @param {string} [message]
   * @param {string} [type]
   * @returns {TestCase}
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
   * @param {string} [message]
   * @param {string} [type]
   * @param {string} [content]
   * @returns {TestCase}
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
   * @param {string} [stacktrace]
   * @returns {TestCase}
   * @chainable
   */
  stacktrace(stacktrace) {
    this._failure = true;
    this._stacktrace = stacktrace;
    return this;
  }

  /**
   * @returns {TestCase}
   * @chainable
   */
  skipped() {
    this._skipped = true;
    return this;
  }

  /**
   * @param {string} [log]
   * @returns {TestCase}
   * @chainable
   */
  standardOutput(log) {
    this._standardOutput = log;
    return this;
  }

  /**
   * @param {string} [log]
   * @returns {TestCase}
   * @chainable
   */
  standardError(log) {
    this._standardError = log;
    return this;
  }

  /**
   * @returns {number}
   */
  getTestCaseCount() {
    return 1;
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
   *
   * @param {string} path
   * @returns {TestCase}
   * @chainable
   */
  errorAttachment(path) {
    this._errorAttachment = path;
    return this;
  }

  /**
   * @param {import('xmlbuilder').XMLElement} parentElement
   */
  build(parentElement) {
    const testCaseElement = this.buildNode(this.createElement(parentElement));
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
    return testCaseElement;
  }
}

module.exports = { TestCase: TestCase };

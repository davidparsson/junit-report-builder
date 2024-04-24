import _ from 'lodash';
import { TestNode } from './test_node';
import type { XMLElement } from 'xmlbuilder';

export class TestCase extends TestNode {
  private _error: boolean;
  private _failure: boolean;
  private _skipped: boolean;
  private _standardOutput: string | undefined;
  private _standardError: string | undefined;
  private _stacktrace: string | undefined;
  private _errorAttributes: any;
  private _failureAttributes: any;
  private _errorAttachment: string | undefined;
  private _errorContent: string | undefined;

  constructor() {
    super('testcase');
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
   * @param className
   * @returns this
   */
  className(className: string): this {
    this._attributes.classname = className;
    return this;
  }

  /**
   * @param {string} filepath
   * @returns {TestCase}
   */
  file(filepath: string) {
    this._attributes.file = filepath;
    return this;
  }

  /**
   * @param message
   * @param type
   * @returns this
   */
  failure(message?: string, type?: string): this {
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
   * @param message
   * @param type
   * @param content
   * @returns this
   */
  error(message?: string, type?: string, content?: string): this {
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
   * @param stacktrace
   * @returns this
   */
  stacktrace(stacktrace?: string): this {
    this._failure = true;
    this._stacktrace = stacktrace;
    return this;
  }

  /**
   * @returns this
   */
  skipped(): this {
    this._skipped = true;
    return this;
  }

  /**
   * @param log
   * @returns this
   */
  standardOutput(log?: string): this {
    this._standardOutput = log;
    return this;
  }

  /**
   * @param log
   * @returns this
   */
  standardError(log?: string): this {
    this._standardError = log;
    return this;
  }

  /**
   * @inheritdoc
   */
  override getTestCaseCount(): number {
    return 1;
  }

  /**
   * @inheritdoc
   */
  override getFailureCount(): number {
    return this._failure ? 1 : 0;
  }

  /**
   * @inheritdoc
   */
  override getErrorCount(): number {
    return this._error ? 1 : 0;
  }

  /**
   * @inheritdoc
   */
  override getSkippedCount() {
    return this._skipped ? 1 : 0;
  }

  /**
   *
   * @param path
   * @returns this
   */
  errorAttachment(path: string): this {
    this._errorAttachment = path;
    return this;
  }

  /**
   * @param parentElement - the parent element
   */
  build(parentElement: XMLElement) {
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

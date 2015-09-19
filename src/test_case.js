/**
Represents a test case. Will result in a single `<testcase>` element.
@class
*/
function TestCase() {
  this._failure = false;
  this._skipped = false;
  this._stacktrace = undefined;
  this._attributes = {};
  this._failureAttributes = {};
}

/**
Sets the class in which the test case is located.
@param {string} className
@return {TestCase}
*/
TestCase.prototype.className = function (className) {
  this._attributes.classname = className;
  return this;
};

/**
Sets the test case name.
@param {string} name
@return {TestCase}
*/
TestCase.prototype.name = function (name) {
  this._attributes.name = name;
  return this;
};

/**
Sets the test case execution time in seconds.
@param {string} time
@return {TestCase}
*/
TestCase.prototype.time = function (time) {
  this._attributes.time = time;
  return this;
};

/**
Marks the test case as failed, with an optional failure message.
@param {string=} message
@return {TestCase}
*/
TestCase.prototype.failure = function (message) {
  this._failure = true;
  if (message) {
    this._failureAttributes.message = message;
  }
  return this;
};

/**
Attach a stacktrace to the test case.
@param {string} stacktrace
@return {TestCase}
*/
TestCase.prototype.stacktrace = function (stacktrace) {
  this._failure = true;
  this._stacktrace = stacktrace;
  return this;
};

/**
Marks the test case as skipped.
@return {TestCase}
*/
TestCase.prototype.skipped = function () {
  this._skipped = true;
  return this;
};

/**
Builds and adds this subtree's XML to its parent element.
@private
@param {parentElement}
*/
TestCase.prototype.build = function (parentElement) {
  var testCaseElement = parentElement.ele('testcase', this._attributes);
  if (this._failure) {
    var failureElement = testCaseElement.ele('failure', this._failureAttributes);
    if (this._stacktrace) {
      failureElement.cdata(this._stacktrace);
    }
  }
  if (this._skipped) {
    testCaseElement.ele('skipped');
  }
};

module.exports = TestCase;

function TestCase() {
  this._failure = false;
  this._skipped = false;
  this._stacktrace = undefined;
  this._attributes = {};
  this._failureAttributes = {};
}

TestCase.prototype.className = function (className) {
  this._attributes.classname = className;
  return this;
};

TestCase.prototype.name = function (name) {
  this._attributes.name = name;
  return this;
};

TestCase.prototype.time = function (time) {
  this._attributes.time = time;
  return this;
};

TestCase.prototype.failure = function (message) {
  this._failure = true;
  if (message) {
    this._failureAttributes.message = message;
  }
  return this;
};

TestCase.prototype.stacktrace = function (stacktrace) {
  this._failure = true;
  this._stacktrace = stacktrace;
  return this;
};

TestCase.prototype.skipped = function () {
  this._skipped = true;
  return this;
};

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

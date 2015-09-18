function TestCase() {
  this._failure = false;
  this._error = false;
  this._skipped = false;
  this._stacktrace = undefined;
  this._stdout = undefined;
  this._stderr = undefined;
  this._attributes = {};
  this._failureAttributes = {};
  this._errorAttributes = {};
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

TestCase.prototype.error = function (message) {
  this._error = true;
  if (message) {
    this._errorAttributes.message = message;
  }
  return this;
};

TestCase.prototype.stacktrace = function (stacktrace) {
  this._failure = true;
  this._stacktrace = stacktrace;
  return this;
};

TestCase.prototype.appendStdout = function (stdout)
{
    if(!this._stdout) this._stdout = "";
    this._stdout += stdout+'\n';

};

TestCase.prototype.appendStderr = function (stderr)
{
    if(!this._stderr) this._stderr = "";
    this._stderr += stderr+'\n';

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
  if (this._error) {
    testCaseElement.ele('error', this._errorAttributes);
  }
  if (this._stderr) {
    var stderrElement = testCaseElement.ele('system-err');
    stderrElement.cdata(this._stderr);
  }
  if (this._stdout) {
    var stdoutElement = testCaseElement.ele('system-out');
    stdoutElement.cdata(this._stdout);
  }
  if (this._skipped) {
    testCaseElement.ele('skipped');
  }
};

module.exports = TestCase;
// vim:sw=2:sts=2:ts=2:et

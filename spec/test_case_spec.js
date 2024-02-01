const { TestCase } = require('../src/test_case');

describe('Test Case builder', function () {
  let testCase = null;
  let parentElement = null;
  let propertiesElement = null;
  let testCaseElement = null;
  let failureElement = null;
  let skippedElement = null;
  let systemOutElement = null;
  let systemErrElement = null;

  const createElementMock = (elementName) => jasmine.createSpyObj(elementName, ['ele', 'cdata', 'att', 'txt']);

  beforeEach(function () {
    testCase = new TestCase();
    parentElement = createElementMock('parentElement');
    testCaseElement = createElementMock('testCaseElement');
    failureElement = createElementMock('failureElement');
    skippedElement = createElementMock('skippedElement');
    systemOutElement = createElementMock('systemOutElement');
    systemErrElement = createElementMock('systemErrElement');
    propertiesElement = createElementMock('propertiesElement');

    parentElement.ele.and.callFake(function (elementName) {
      switch (elementName) {
        case 'testcase':
          return testCaseElement;
      }
    });

    testCaseElement.ele.and.callFake(function (elementName) {
      switch (elementName) {
        case 'failure':
          return failureElement;
        case 'skipped':
          return skippedElement;
        case 'system-out':
          return systemOutElement;
        case 'system-err':
          return systemErrElement;
        case 'properties':
          return propertiesElement;
      }
    });

    systemErrElement.cdata.and.callFake(function (stdError) {
      switch (stdError) {
        case 'Error with screenshot':
          return systemErrElement;
      }
    });
  });

  it('should build a testcase element without attributes by default', function () {
    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {});
  });

  it('should add the provided class name as an attribute', function () {
    testCase.className('my.Class');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      classname: 'my.Class',
    });
  });

  it('should add the provided name as an attribute', function () {
    testCase.name('my test name');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      name: 'my test name',
    });
  });

  it('should add the provided time as an attribute', function () {
    testCase.time(100);

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      time: 100,
    });
  });

  it('should add the provided file as an attribute', function () {
    testCase.file('./path-to/the-test-file.coffee');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      file: './path-to/the-test-file.coffee',
    });
  });

  it('should add the provided property as elements', function () {
    testCase.property('property name', 'property value');

    testCase.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'property name',
      value: 'property value',
    });
  });

  it('should add a failure node when test failed', function () {
    testCase.failure();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {});
  });

  it('should add a failure node with message when test failed', function () {
    testCase.failure('Failure message');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message',
    });
  });

  it('should add the stactrace to the failure node when stacktrace provided', function () {
    testCase.stacktrace('This is a stacktrace');

    testCase.build(parentElement);

    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace');
  });

  it('should add a failure node with message and stacktrace when both provided', function () {
    testCase.failure('Failure message');
    testCase.stacktrace('This is a stacktrace');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message',
    });
    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace');
  });

  it('should add a skipped node when test failed', function () {
    testCase.skipped();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('skipped');
  });

  it('should add a failure node when test failed', function () {
    testCase.failure();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {});
  });

  it('should add an error node when test errored', function () {
    testCase.error();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {});
  });

  it('should add a error node with message when test errored', function () {
    testCase.error('Error message');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {
      message: 'Error message',
    });
  });

  describe('system-out', function () {
    it('should not create a system-out tag when nothing logged', function () {
      testCase.build(parentElement);

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-out', jasmine.anything());
    });

    it('should create a system-out tag with the log as a cdata tag', function () {
      testCase.standardOutput('Standard output');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-out');
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Standard output');
    });

    it('should only add the last logged content to system-out', function () {
      testCase.standardOutput('Standard output').standardOutput('Second stdout');

      testCase.build(parentElement);

      expect(systemOutElement.cdata).not.toHaveBeenCalledWith('Standard output');
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Second stdout');
    });
  });

  describe('system-err', function () {
    it('should not create a system-err tag when nothing logged', function () {
      testCase.build(parentElement);

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-err', jasmine.anything());
    });

    it('should create a system-err tag with the log as a cdata tag', function () {
      testCase.standardError('Standard error');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Standard error');
    });

    it('should only add the last logged content to system-err', function () {
      testCase.standardError('Standard error').standardError('Second stderr');

      testCase.build(parentElement);

      expect(systemErrElement.cdata).not.toHaveBeenCalledWith('Standard error');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Second stderr');
    });

    it('should add an attachment to system-err', function () {
      testCase.standardError('Error with screenshot');
      testCase.errorAttachment('absolute/path/to/attachment');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Error with screenshot');
      expect(systemErrElement.txt).toHaveBeenCalledWith('[[ATTACHMENT|absolute/path/to/attachment]]');
    });
  });

  describe('failure counting', function () {
    it('should should have 0 failures when not failed', () => expect(testCase.getFailureCount()).toBe(0));

    it('should should have 1 failure when failed', function () {
      testCase.failure();

      expect(testCase.getFailureCount()).toBe(1);
    });

    it('should should have 1 failure when failed many times', function () {
      testCase.failure();
      testCase.failure();

      expect(testCase.getFailureCount()).toBe(1);
    });
  });

  describe('error counting', function () {
    it('should should have 0 errors when error not called', () => expect(testCase.getErrorCount()).toBe(0));

    it('should should have 1 error when error called', function () {
      testCase.error();

      expect(testCase.getErrorCount()).toBe(1);
    });

    it('should should have 1 error when error called many times', function () {
      testCase.error();
      testCase.error();

      expect(testCase.getErrorCount()).toBe(1);
    });
  });

  describe('skipped counting', function () {
    it('should be 0 when skipped not called', () => expect(testCase.getSkippedCount()).toBe(0));

    it('should be 1 when skipped called', function () {
      testCase.skipped();

      expect(testCase.getSkippedCount()).toBe(1);
    });

    it('should be 1 when skipped called many times', function () {
      testCase.skipped();
      testCase.skipped();

      expect(testCase.getSkippedCount()).toBe(1);
    });
  });
});

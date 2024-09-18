import { XMLElement } from 'xmlbuilder';
import { TestCase } from '../src/test_case';

describe('Test Case builder', () => {
  let testCase: TestCase;
  let parentElement: XMLElement;
  let propertiesElement: XMLElement;
  let testCaseElement: XMLElement;
  let failureElement: XMLElement;
  let errorElement: XMLElement;
  let skippedElement: XMLElement;
  let systemOutElement: XMLElement;
  let systemErrElement: XMLElement;

  const createElementMock = () =>
    ({
      ele: jest.fn(),
      cdata: jest.fn(),
      att: jest.fn(),
      txt: jest.fn(),
    }) as unknown as XMLElement;

  beforeEach(() => {
    testCase = new TestCase();
    parentElement = createElementMock();
    testCaseElement = createElementMock();
    failureElement = createElementMock();
    errorElement = createElementMock();
    skippedElement = createElementMock();
    systemOutElement = createElementMock();
    systemErrElement = createElementMock();
    propertiesElement = createElementMock();

    (parentElement.ele as any as jest.SpyInstance).mockImplementation((elementName: string) => {
      switch (elementName) {
        case 'testcase':
          return testCaseElement;
      }
      throw new Error(`Unexpected element name: ${elementName}`);
    });

    (testCaseElement.ele as any as jest.SpyInstance).mockImplementation((elementName: string) => {
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
        case 'error':
          return errorElement;
      }
      throw new Error(`Unexpected element name: ${elementName}`);
    });

    (systemErrElement.cdata as any as jest.SpyInstance).mockImplementation((stdError: string) => {
      switch (stdError) {
        case 'Error with screenshot':
          return systemErrElement;
        case 'Standard error':
          return createElementMock();
        case 'Second stderr':
          return createElementMock();
      }
      throw new Error(`Unexpected element name: ${stdError}`);
    });
  });

  it('should build a testcase element without attributes by default', () => {
    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {});
  });

  it('should add the provided class name as an attribute', () => {
    testCase.className('my.Class');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      classname: 'my.Class',
    });
  });

  it('should add the provided name as an attribute', () => {
    testCase.name('my test name');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      name: 'my test name',
    });
  });

  it('should add the provided time as an attribute', () => {
    testCase.time(100);

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      time: 100,
    });
  });

  it('should add the provided file as an attribute', () => {
    testCase.file('./path-to/the-test-file.coffee');

    testCase.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      file: './path-to/the-test-file.coffee',
    });
  });

  it('should add the provided property as elements', () => {
    testCase.property('property name', 'property value');

    testCase.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'property name',
      value: 'property value',
    });
  });

  it('should add the provided property with textContent as elements with textContent', () => {
    testCase.multilineProperty('property name', 'property value');

    testCase.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith(
      'property',
      {
        name: 'property name',
      },
      'property value',
    );
  });

  it('should add a failure node when test failed', () => {
    testCase.failure();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {});
  });

  it('should add a failure node with message when test failed', () => {
    testCase.failure('Failure message');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message',
    });
  });

  it('should add a failure node with message and type when test failed', () => {
    testCase.failure('Failure message', 'Failure type');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message',
      type: 'Failure type',
    });
  });

  it('should add the stactrace to the failure node when stacktrace provided', () => {
    testCase.stacktrace('This is a stacktrace');

    testCase.build(parentElement);

    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace');
  });

  it('should add a failure node with message and stacktrace when both provided', () => {
    testCase.failure('Failure message');
    testCase.stacktrace('This is a stacktrace');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message',
    });
    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace');
  });

  it('should add a skipped node when test failed', () => {
    testCase.skipped();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('skipped');
  });

  it('should add a failure node when test failed', () => {
    testCase.failure();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {});
  });

  it('should add an error node when test errored', () => {
    testCase.error();

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {});
  });

  it('should add a error node with message when test errored', () => {
    testCase.error('Error message');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {
      message: 'Error message',
    });
  });

  it('should add a error node with message and type when test errored', () => {
    testCase.error('Error message', 'Error type');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {
      message: 'Error message',
      type: 'Error type',
    });
  });

  it('should add a error node with message, type and content when test errored', () => {
    testCase.error('Error message', 'Error type', 'Error content');

    testCase.build(parentElement);

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {
      message: 'Error message',
      type: 'Error type',
    });
    expect(errorElement.cdata).toHaveBeenCalledWith('Error content');
  });

  describe('system-out', () => {
    it('should not create a system-out tag when nothing logged', () => {
      testCase.build(parentElement);

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-out', expect.anything());
    });

    it('should create a system-out tag with the log as a cdata tag', () => {
      testCase.standardOutput('Standard output');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-out');
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Standard output');
    });

    it('should only add the last logged content to system-out', () => {
      testCase.standardOutput('Standard output').standardOutput('Second stdout');

      testCase.build(parentElement);

      expect(systemOutElement.cdata).not.toHaveBeenCalledWith('Standard output');
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Second stdout');
    });
  });

  describe('system-err', () => {
    it('should not create a system-err tag when nothing logged', () => {
      testCase.build(parentElement);

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-err', expect.anything());
    });

    it('should create a system-err tag with the log as a cdata tag', () => {
      testCase.standardError('Standard error');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Standard error');
    });

    it('should only add the last logged content to system-err', () => {
      testCase.standardError('Standard error').standardError('Second stderr');

      testCase.build(parentElement);

      expect(systemErrElement.cdata).not.toHaveBeenCalledWith('Standard error');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Second stderr');
    });

    it('should add an attachment to system-err', () => {
      testCase.standardError('Error with screenshot');
      testCase.errorAttachment('absolute/path/to/attachment');

      testCase.build(parentElement);

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err');
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Error with screenshot');
      expect(systemErrElement.txt).toHaveBeenCalledWith('[[ATTACHMENT|absolute/path/to/attachment]]');
    });
  });

  describe('failure counting', () => {
    it('should should have 0 failures when not failed', () => expect(testCase.getFailureCount()).toBe(0));

    it('should should have 1 failure when failed', () => {
      testCase.failure();

      expect(testCase.getFailureCount()).toBe(1);
    });

    it('should should have 1 failure when failed many times', () => {
      testCase.failure();
      testCase.failure();

      expect(testCase.getFailureCount()).toBe(1);
    });
  });

  describe('error counting', () => {
    it('should should have 0 errors when error not called', () => expect(testCase.getErrorCount()).toBe(0));

    it('should should have 1 error when error called', () => {
      testCase.error();

      expect(testCase.getErrorCount()).toBe(1);
    });

    it('should should have 1 error when error called many times', () => {
      testCase.error();
      testCase.error();

      expect(testCase.getErrorCount()).toBe(1);
    });
  });

  describe('skipped counting', () => {
    it('should be 0 when skipped not called', () => expect(testCase.getSkippedCount()).toBe(0));

    it('should be 1 when skipped called', () => {
      testCase.skipped();

      expect(testCase.getSkippedCount()).toBe(1);
    });

    it('should be 1 when skipped called many times', () => {
      testCase.skipped();
      testCase.skipped();

      expect(testCase.getSkippedCount()).toBe(1);
    });
  });

  describe('test case counting', () => {
    it('should be 1 for a test case', () => expect(testCase.getTestCaseCount()).toBe(1));
  });
});

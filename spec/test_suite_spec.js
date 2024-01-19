const { TestSuite } = require('../src/test_suite');

describe('Test Suite builder', function () {
  let testSuite = null;
  let parentElement = null;
  let testSuiteElement = null;
  let propertiesElement = null;
  let testCase = null;

  beforeEach(function () {
    const factory = jasmine.createSpyObj('factory', ['newTestCase']);
    testCase = jasmine.createSpyObj('testCase', [
      'build',
      'getFailureCount',
      'getErrorCount',
      'getSkippedCount',
      'getTestCaseCount',
    ]);

    factory.newTestCase.and.callFake(() => testCase);

    parentElement = jasmine.createSpyObj('parentElement', ['ele']);
    testSuiteElement = jasmine.createSpyObj('testSuiteElement', ['ele']);
    propertiesElement = jasmine.createSpyObj('propertiesElement', ['ele']);

    testSuite = new TestSuite(factory);

    parentElement.ele.and.callFake(function (elementName) {
      switch (elementName) {
        case 'testsuite':
          return testSuiteElement;
      }
    });

    testSuiteElement.ele.and.callFake(function (elementName) {
      switch (elementName) {
        case 'properties':
          return propertiesElement;
      }
    });

    testCase.getTestCaseCount.and.callFake(() => 1);

    testCase.getFailureCount.and.callFake(() => 0);

    testCase.getErrorCount.and.callFake(() => 0);

    testCase.getSkippedCount.and.callFake(() => 0);
  });

  it('should create a testsuite element when building', function () {
    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        tests: 0,
      }),
    );
  });

  it('should add the provided name as an attribute', function () {
    testSuite.name('suite name');

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        name: 'suite name',
      }),
    );
  });

  it('should count the number of testcase elements', function () {
    testSuite.testCase();

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        tests: 1,
      }),
    );
  });

  it('should add the provided time as an attribute', function () {
    testSuite.time(12.3);

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        time: 12.3,
      }),
    );
  });

  it('should add the provided timestamp as an attribute', function () {
    testSuite.timestamp('2014-10-21T12:36:58');

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        timestamp: '2014-10-21T12:36:58',
      }),
    );
  });

  it('should format the provided timestamp date and add it as an attribute', function () {
    testSuite.timestamp(new Date(2015, 10, 22, 13, 37, 59, 123));

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      jasmine.objectContaining({
        timestamp: '2015-11-22T13:37:59',
      }),
    );
  });

  it('should add the provided property as elements', function () {
    testSuite.property('property name', 'property value');

    testSuite.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'property name',
      value: 'property value',
    });
  });

  it('should add all the provided properties as elements', function () {
    testSuite.property('name 1', 'value 1');
    testSuite.property('name 2', 'value 2');

    testSuite.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'name 1',
      value: 'value 1',
    });
    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'name 2',
      value: 'value 2',
    });
  });

  it('should pass testsuite element to the test case when building', function () {
    testSuite.testCase();

    testSuite.build(parentElement);

    expect(testCase.build).toHaveBeenCalledWith(testSuiteElement);
  });

  it('should pass testsuite element to all created test cases when building', function () {
    testSuite.testCase();
    testSuite.testCase();

    testSuite.build(parentElement);

    expect(testCase.build.calls.count()).toEqual(2);
    expect(testCase.build.calls.argsFor(0)).toEqual([testSuiteElement]);
    expect(testCase.build.calls.argsFor(1)).toEqual([testSuiteElement]);
  });

  it('should return the newly created test case', () => expect(testSuite.testCase()).toEqual(testCase));

  it('should itself when configuring property', () => expect(testSuite.property('name', 'value')).toEqual(testSuite));

  it('should itself when configuring name', () => expect(testSuite.name('name')).toEqual(testSuite));

  describe('failure count', function () {
    it('should not report any failures when no test cases', function () {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          failures: 0,
        }),
      );
    });

    it('should not report any failures when no test cases failed', function () {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          failures: 0,
        }),
      );
    });

    it('should report two failures when two test cases failed', function () {
      testCase.getFailureCount.and.callFake(() => 1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          failures: 2,
        }),
      );
    });
  });

  describe('error count', function () {
    it('should not report any errors when no test cases', function () {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          errors: 0,
        }),
      );
    });

    it('should not report any errors when no test cases errored', function () {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          errors: 0,
        }),
      );
    });

    it('should report two errors when two test cases errored', function () {
      testCase.getErrorCount.and.callFake(() => 1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          errors: 2,
        }),
      );
    });
  });

  describe('skipped count', function () {
    it('should not report any skipped when no test cases', function () {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          skipped: 0,
        }),
      );
    });

    it('should not report any skipped when no test cases errored', function () {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          skipped: 0,
        }),
      );
    });

    it('should report two skipped when two test cases errored', function () {
      testCase.getSkippedCount.and.callFake(() => 1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        jasmine.objectContaining({
          skipped: 2,
        }),
      );
    });
  });
});

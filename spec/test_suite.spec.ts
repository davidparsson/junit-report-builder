import { XMLElement } from 'xmlbuilder';
import { Factory } from '../src/factory';
import { TestSuite } from '../src/test_suite';
import { TestCase } from '../src/test_case';

describe('Test Suite builder', () => {
  let testSuite: TestSuite;
  let parentElement: XMLElement;
  let testSuiteElement: XMLElement;
  let propertiesElement: XMLElement;
  let testCase: TestCase;

  beforeEach(() => {
    testCase = {
      build: jest.fn(),
      getFailureCount: jest.fn().mockReturnValue(0),
      getErrorCount: jest.fn().mockReturnValue(0),
      getSkippedCount: jest.fn().mockReturnValue(0),
      getTestCaseCount: jest.fn().mockReturnValue(1),
    } as unknown as TestCase;

    const factory = {
      newTestCase: jest.fn().mockReturnValue(testCase),
    } as unknown as Factory;

    propertiesElement = { ele: jest.fn() } as unknown as XMLElement;
    testSuiteElement = {
      ele: jest.fn().mockImplementation((elementName: string) => {
        switch (elementName) {
          case 'properties':
            return propertiesElement;
        }
        throw new Error(`Unexpected element name: ${elementName}`);
      }),
    } as unknown as XMLElement;
    parentElement = {
      ele: jest.fn().mockImplementation((elementName: string) => {
        switch (elementName) {
          case 'testsuite':
            return testSuiteElement;
        }
        throw new Error(`Unexpected element name: ${elementName}`);
      }),
    } as unknown as XMLElement;
    testSuite = new TestSuite(factory);
  });

  it('should create a testsuite element when building', () => {
    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        tests: 0,
      }),
    );
  });

  it('should add the provided name as an attribute', () => {
    testSuite.name('suite name');

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        name: 'suite name',
      }),
    );
  });

  it('should count the number of testcase elements', () => {
    testSuite.testCase();

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        tests: 1,
      }),
    );
  });

  it('should add the provided time as an attribute', () => {
    testSuite.time(12.3);

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        time: 12.3,
      }),
    );
  });

  it('should add the provided timestamp as an attribute', () => {
    testSuite.timestamp('2014-10-21T12:36:58');

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        timestamp: '2014-10-21T12:36:58',
      }),
    );
  });

  it('should format the provided timestamp date and add it as an attribute', () => {
    testSuite.timestamp(new Date(2015, 10, 22, 13, 37, 59, 123));

    testSuite.build(parentElement);

    expect(parentElement.ele).toHaveBeenCalledWith(
      'testsuite',
      expect.objectContaining({
        timestamp: '2015-11-22T13:37:59',
      }),
    );
  });

  it('should add the provided property as elements', () => {
    testSuite.property('property name', 'property value');

    testSuite.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'property name',
      value: 'property value',
    });
  });

  it('should add the provided property with textContent as element with textContent', () => {
    testSuite.multilineProperty('property name', 'property value');

    testSuite.build(parentElement);

    expect(propertiesElement.ele).toHaveBeenCalledWith(
      'property',
      {
        name: 'property name',
      },
      'property value',
    );
  });

  it('should add all the provided properties as elements', () => {
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

  it('should pass testsuite element to the test case when building', () => {
    testSuite.testCase();

    testSuite.build(parentElement);

    expect(testCase.build).toHaveBeenCalledWith(testSuiteElement);
  });

  it('should pass testsuite element to all created test cases when building', () => {
    testSuite.testCase();
    testSuite.testCase();

    testSuite.build(parentElement);

    const spy: jest.SpyInstance = testCase.build as any;
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toEqual(testSuiteElement);
    expect(spy.mock.calls[1][0]).toEqual(testSuiteElement);
  });

  it('should return the newly created test case', () => expect(testSuite.testCase()).toEqual(testCase));

  it('should itself when configuring property', () => expect(testSuite.property('name', 'value')).toEqual(testSuite));

  it('should itself when configuring name', () => expect(testSuite.name('name')).toEqual(testSuite));

  describe('failure count', () => {
    it('should not report any failures when no test cases', () => {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          failures: 0,
        }),
      );
    });

    it('should not report any failures when no test cases failed', () => {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          failures: 0,
        }),
      );
    });

    it('should report two failures when two test cases failed', () => {
      (testCase.getFailureCount as any as jest.SpyInstance).mockReturnValue(1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          failures: 2,
        }),
      );
    });
  });

  describe('error count', () => {
    it('should not report any errors when no test cases', () => {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          errors: 0,
        }),
      );
    });

    it('should not report any errors when no test cases errored', () => {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          errors: 0,
        }),
      );
    });

    it('should report two errors when two test cases errored', () => {
      (testCase.getErrorCount as any as jest.SpyInstance).mockReturnValue(1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          errors: 2,
        }),
      );
    });
  });

  describe('skipped count', () => {
    it('should not report any skipped when no test cases', () => {
      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          skipped: 0,
        }),
      );
    });

    it('should not report any skipped when no test cases errored', () => {
      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          skipped: 0,
        }),
      );
    });

    it('should report two skipped when two test cases errored', () => {
      (testCase.getSkippedCount as any as jest.SpyInstance).mockReturnValue(1);

      testSuite.testCase();
      testSuite.testCase();

      testSuite.build(parentElement);

      expect(parentElement.ele).toHaveBeenCalledWith(
        'testsuite',
        expect.objectContaining({
          skipped: 2,
        }),
      );
    });
  });
});

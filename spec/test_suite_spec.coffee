TestSuite = require '../src/test_suite'


describe 'Test Suite builder', ->
  testSuite = null
  parentElement = null
  testSuiteElement = null
  propertiesElement = null
  testCase = null


  beforeEach ->
    factory = jasmine.createSpyObj 'factory', ['newTestCase']
    testCase = jasmine.createSpyObj 'testCase', ['build', 'getFailureCount', 'getErrorCount', 'getSkippedCount']

    factory.newTestCase.and.callFake () ->
      return testCase

    parentElement = jasmine.createSpyObj 'parentElement', ['ele']
    testSuiteElement = jasmine.createSpyObj 'testSuiteElement', ['ele']
    propertiesElement = jasmine.createSpyObj 'propertiesElement', ['ele']

    testSuite = new TestSuite factory

    parentElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'testsuite' then return testSuiteElement

    testSuiteElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'properties' then return propertiesElement

    testCase.getFailureCount.and.callFake () ->
      return 0

    testCase.getErrorCount.and.callFake () ->
      return 0

    testCase.getSkippedCount.and.callFake () ->
      return 0


  it 'should create a testsuite element when building', ->
    testSuite.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
      tests: 0
    }))


  it 'should add the provided name as an attribute', ->
    testSuite.name 'suite name'

    testSuite.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
      name: 'suite name'
    }))


  it 'should count the number of testcase elements', ->
    testSuite.testCase()

    testSuite.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
      tests: 1
    }))


  it 'should add the provided property as elements', ->
    testSuite.property 'property name', 'property value'

    testSuite.build parentElement

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'property name',
      value: 'property value'
    })


  it 'should add all the provided properties as elements', ->
    testSuite.property 'name 1', 'value 1'
    testSuite.property 'name 2', 'value 2'

    testSuite.build parentElement

    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'name 1',
      value: 'value 1'
    })
    expect(propertiesElement.ele).toHaveBeenCalledWith('property', {
      name: 'name 2',
      value: 'value 2'
    })


  it 'should pass testsuite element to the test case when building', ->
    testSuite.testCase()

    testSuite.build parentElement

    expect(testCase.build).toHaveBeenCalledWith(testSuiteElement)


  it 'should pass testsuite element to all created test cases when building', ->
    testSuite.testCase()
    testSuite.testCase()

    testSuite.build parentElement

    expect(testCase.build.calls.count()).toEqual(2)
    expect(testCase.build.calls.argsFor(0)).toEqual([testSuiteElement])
    expect(testCase.build.calls.argsFor(1)).toEqual([testSuiteElement])


  it 'should return the newly created test case', ->
    expect(testSuite.testCase()).toEqual(testCase)


  it 'should return itself when configuring property', ->
    expect(testSuite.property('name', 'value')).toEqual(testSuite)


  it 'should return itself when configuring name', ->
    expect(testSuite.name('name')).toEqual(testSuite)

  describe 'failure count', ->
    it 'should not report any failures when no test cases', ->
      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        failures: 0
      }))


    it 'should not report any failures when no test cases failed', ->
      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        failures: 0
      }))


    it 'should report two failures when two test cases failed', ->
      testCase.getFailureCount.and.callFake () ->
        return 1

      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        failures: 2
      }))


  describe 'error count', ->
    it 'should not report any errors when no test cases', ->
      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        errors: 0
      }))


    it 'should not report any errors when no test cases errored', ->
      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        errors: 0
      }))


    it 'should report two errors when two test cases errored', ->
      testCase.getErrorCount.and.callFake () ->
        return 1

      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        errors: 2
      }))


  describe 'skipped count', ->
    it 'should not report any skipped when no test cases', ->
      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        skipped: 0
      }))


    it 'should not report any skipped when no test cases errored', ->
      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        skipped: 0
      }))


    it 'should report two skipped when two test cases errored', ->
      testCase.getSkippedCount.and.callFake () ->
        return 1

      testSuite.testCase()
      testSuite.testCase()

      testSuite.build parentElement

      expect(parentElement.ele).toHaveBeenCalledWith('testsuite', jasmine.objectContaining({
        skipped: 2
      }))

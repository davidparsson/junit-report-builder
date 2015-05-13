TestSuite = require '../src/test_suite'


describe 'Test Suite builder', ->
  testSuite = null
  parentElement = null
  testSuiteElement = null
  propertiesElement = null


  beforeEach ->
    testSuite = new TestSuite
    parentElement = jasmine.createSpyObj 'parentElement', ['ele']
    testSuiteElement = jasmine.createSpyObj 'testSuiteElement', ['ele']
    propertiesElement = jasmine.createSpyObj 'propertiesElement', ['ele']

    parentElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'testsuite' then return testSuiteElement

    testSuiteElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'properties' then return propertiesElement


  it 'should create a testsuite element when building', ->
    testSuite.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testsuite', {})


  it 'should add the provided name as an attribute', ->
    testSuite.name 'suite name'

    testSuite.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testsuite', {
      name: 'suite name'
    })


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

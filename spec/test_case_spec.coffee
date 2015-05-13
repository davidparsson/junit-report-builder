TestCase = require '../src/test_case'


describe 'Test Case builder', ->
  testCase = null
  parentElement = null
  testCaseElement = null
  failureElement = null
  skippedElement = null


  beforeEach ->
    testCase = new TestCase()
    parentElement = jasmine.createSpyObj('parentElement', ['ele'])
    testCaseElement = jasmine.createSpyObj('testCaseElement', ['ele'])
    failureElement = jasmine.createSpyObj('failureElement', ['ele', 'cdata'])
    skippedElement = jasmine.createSpyObj('skippedElement', ['ele'])

    parentElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'testcase' then return testCaseElement

    testCaseElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'failure' then return failureElement
        when 'skipped' then return skippedElement


  it 'should build a testcase element without attributes by default', ->
    testCase.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {})


  it 'should add the provided class name as an attribute', ->
    testCase.className 'my.Class'

    testCase.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      classname: 'my.Class'
    })


  it 'should add the provided name as an attribute', ->
    testCase.name 'my test name'

    testCase.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      name: 'my test name'
    })


  it 'should add the provided time as an attribute', ->
    testCase.time 100

    testCase.build parentElement

    expect(parentElement.ele).toHaveBeenCalledWith('testcase', {
      time: 100
    })


  it 'should add a failure node when test failed', ->
    testCase.failure()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {})


  it 'should add a failure node with message when test failed', ->
    testCase.failure 'Failure message'

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message'
    })


  it 'should add the stactrace to the failure node when stacktrace provided', ->
    testCase.stacktrace 'This is a stacktrace'

    testCase.build parentElement

    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace')


  it 'should add a skipped node when test failed', ->
    testCase.skipped()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('skipped')


  it 'should add a failure node when test failed', ->
    testCase.failure()
    testCase.skipped()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {})
    expect(testCaseElement.ele).toHaveBeenCalledWith('skipped')

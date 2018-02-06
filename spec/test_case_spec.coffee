TestCase = require '../src/test_case'


describe 'Test Case builder', ->
  testCase = null
  parentElement = null
  testCaseElement = null
  failureElement = null
  skippedElement = null
  systemOutElement = null
  systemErrElement = null

  createElementMock = (elementName) ->
    jasmine.createSpyObj(elementName, ['ele', 'cdata', 'att', 'txt'])

  beforeEach ->
    testCase = new TestCase()
    parentElement = createElementMock('parentElement')
    testCaseElement = createElementMock('testCaseElement')
    failureElement = createElementMock('failureElement')
    skippedElement = createElementMock('skippedElement')
    systemOutElement = createElementMock('systemOutElement')
    systemErrElement = createElementMock('systemErrElement')

    parentElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'testcase' then return testCaseElement

    testCaseElement.ele.and.callFake (elementName) ->
      switch elementName
        when 'failure' then return failureElement
        when 'skipped' then return skippedElement
        when 'system-out' then return systemOutElement
        when 'system-err' then return systemErrElement

    systemErrElement.cdata.and.callFake (stdError) ->
      switch stdError
        when 'Error with screenshot' then return systemErrElement

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


  it 'should add a failure node with message and stacktrace when both provided', ->
    testCase.failure 'Failure message'
    testCase.stacktrace 'This is a stacktrace'

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {
      message: 'Failure message'
    })
    expect(failureElement.cdata).toHaveBeenCalledWith('This is a stacktrace')


  it 'should add a skipped node when test failed', ->
    testCase.skipped()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('skipped')


  it 'should add a failure node when test failed', ->
    testCase.failure()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('failure', {})


  it 'should add an error node when test errored', ->
    testCase.error()

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {})


  it 'should add a error node with message when test errored', ->
    testCase.error 'Error message'

    testCase.build parentElement

    expect(testCaseElement.ele).toHaveBeenCalledWith('error', {
      message: 'Error message'
    })


  describe 'system-out', ->
    it 'should not create a system-out tag when nothing logged', ->
      testCase.build parentElement

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-out', jasmine.anything())


    it 'should create a system-out tag with the log as a cdata tag', ->
      testCase.standardOutput('Standard output')

      testCase.build parentElement

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-out')
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Standard output')


    it 'should only add the last logged content to system-out', ->
      testCase.standardOutput('Standard output').standardOutput('Second stdout')

      testCase.build parentElement

      expect(systemOutElement.cdata).not.toHaveBeenCalledWith('Standard output')
      expect(systemOutElement.cdata).toHaveBeenCalledWith('Second stdout')


  describe 'system-err', ->
    it 'should not create a system-err tag when nothing logged', ->
      testCase.build parentElement

      expect(testCaseElement.ele).not.toHaveBeenCalledWith('system-err', jasmine.anything())


    it 'should create a system-err tag with the log as a cdata tag', ->
      testCase.standardError('Standard error')

      testCase.build parentElement

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err')
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Standard error')


    it 'should only add the last logged content to system-err', ->
      testCase.standardError('Standard error').standardError('Second stderr')

      testCase.build parentElement

      expect(systemErrElement.cdata).not.toHaveBeenCalledWith('Standard error')
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Second stderr')

    it 'should add an attachment to system-err', ->
      testCase.standardError('Error with screenshot')
      testCase.errorAttachment('absolute/path/to/attachment')

      testCase.build parentElement

      expect(testCaseElement.ele).toHaveBeenCalledWith('system-err')
      expect(systemErrElement.cdata).toHaveBeenCalledWith('Error with screenshot')
      expect(systemErrElement.txt).toHaveBeenCalledWith('[[ATTACHMENT|absolute/path/to/attachment]]')


  describe 'failure counting', ->
    it 'should should have 0 failures when not failed', ->
      expect(testCase.getFailureCount()).toBe(0)


    it 'should should have 1 failure when failed', ->
      testCase.failure()

      expect(testCase.getFailureCount()).toBe(1)


    it 'should should have 1 failure when failed many times', ->
      testCase.failure()
      testCase.failure()

      expect(testCase.getFailureCount()).toBe(1)


  describe 'error counting', ->
    it 'should should have 0 errors when error not called', ->
      expect(testCase.getErrorCount()).toBe(0)


    it 'should should have 1 error when error called', ->
      testCase.error()

      expect(testCase.getErrorCount()).toBe(1)


    it 'should should have 1 error when error called many times', ->
      testCase.error()
      testCase.error()

      expect(testCase.getErrorCount()).toBe(1)


  describe 'skipped counting', ->
    it 'should be 0 when skipped not called', ->
      expect(testCase.getSkippedCount()).toBe(0)


    it 'should be 1 when skipped called', ->
      testCase.skipped()

      expect(testCase.getSkippedCount()).toBe(1)


    it 'should be 1 when skipped called many times', ->
      testCase.skipped()
      testCase.skipped()

      expect(testCase.getSkippedCount()).toBe(1)

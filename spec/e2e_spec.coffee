factory = require('../' + require('../package').main.replace('.js', ''))
rmdir = require 'rimraf'
fs = require 'fs'

describe 'JUnit Report builder', ->
  builder = null


  beforeEach ->
    builder = factory.createBuilder()

  beforeAll (done) ->
    rmdir 'build/tmp/test_resources', (error) ->
      if error
        throw new Error(error)
      done()

  it 'should produce a report identical to the expected one', ->
    builder.testCase().className("root.test.Class1")
    suite1 = builder.testSuite().name("first.Suite")
    suite1.testCase().name("Second test")
    suite1.testCase().className("suite1.test.Class2").name("Third test")
    suite2 = builder.testSuite().name("second.Suite")
    suite2.testCase().failure("Failure message")
    suite2.testCase().stacktrace("Stacktrace")
    suite2.testCase().skipped()

    builder.writeTo('build/tmp/test_resources/actual_report.xml')

    actual = fs.readFileSync('build/tmp/test_resources/actual_report.xml')
      .toString()
    expected = fs.readFileSync('spec/expected_report.xml').toString()

    expect(actual).toBe(expected)


  it 'should produce an empty list of test suites when nothing reported', ->
    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites/>')


  it 'should produce an empty test suite when a test suite reported', ->
    builder.testSuite()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testsuite/>\n' +
      '</testsuites>')


  it 'should produce a root test case when reported', ->
    builder.testCase()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testcase/>\n' +
      '</testsuites>')


  it 'should produce a test suite with a test case when reported', ->
    builder.testSuite().testCase()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testsuite>\n' +
      '    <testcase/>\n' +
      '  </testsuite>\n' +
      '</testsuites>')


  it 'should output test suites and test cases in the order reported', ->
    builder.testCase().name(1)
    builder.testSuite().name(2)
    builder.testCase().name(3)

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testcase name="1"/>\n' +
      '  <testsuite name="2"/>\n' +
      '  <testcase name="3"/>\n' +
      '</testsuites>')

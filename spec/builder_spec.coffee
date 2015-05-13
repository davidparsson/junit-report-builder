Builder = require '../src/builder'
Factory = require '../src/factory'


describe 'JUnit Report builder', ->
  builder = null


  beforeEach ->
    builder = new Builder(new Factory)


  it 'should should produce an empty list of test suites when nothing reported', ->
    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites/>')


  it 'should should produce an empty test suite when a test suite reported', ->
    builder.testSuite()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testsuite/>\n' +
      '</testsuites>')


  it 'should should produce a root test case when reported', ->
    builder.testCase()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testcase/>\n' +
      '</testsuites>')


  it 'should should produce a test suite with a test case when reported', ->
    builder.testSuite().testCase()

    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testsuite>\n' +
      '    <testcase/>\n' +
      '  </testsuite>\n' +
      '</testsuites>')


  it 'should should output test suites and test cases in the order reported', ->
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

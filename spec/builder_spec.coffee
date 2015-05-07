Builder = require '../src/builder'

describe 'JUnit XML builder', ->
  builder = new Builder()

  it 'should should produce an empty test suite when nothing reported', ->
    expect(builder.build()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites/>')

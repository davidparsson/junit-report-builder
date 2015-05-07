Builder = require '../index'

describe 'JUnit XML builder', ->
  builder = new Builder()

  it 'should be testable', ->
    expect(builder.build()).toBe(null)

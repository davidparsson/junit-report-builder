Builder = require '../src/builder'


describe 'Report builder', ->
  builder = null


  beforeEach ->
    builder = new Builder()


  it 'should should produce an empty test suite when nothing reported', ->
    expect(builder.build()).toBe(
      '<?xml version="1.0"?>\n' +
      '<testsuites/>')

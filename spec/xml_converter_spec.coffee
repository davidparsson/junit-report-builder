XmlConverter = require '../src/xml_converter'

describe 'XML Converter', ->

  it 'should should produce an empty test suite for an empty data set', ->
    converter = new XmlConverter({})
    expect(converter.toXml()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuite/>')

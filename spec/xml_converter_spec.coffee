XmlConverter = require '../src/xml_converter'

describe 'XML Converter', ->

  it 'should should produce an empty test suite for an empty data set', ->
    converter = new XmlConverter({})
    expect(converter.toXml()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites/>')


  it 'should should convert provided json to xml', ->
    data =
      testcase:
        "@":
          name: "Test case name"
          time: 0
          classname: "testcase.ClassName"

    converter = new XmlConverter(data)
    expect(converter.toXml()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '\t<testcase name="Test case name" time="0"' +
        ' classname="testcase.ClassName"/>\n' +
      '</testsuites>')

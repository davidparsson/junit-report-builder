var js2xml = require('js2xmlparser');

function XmlConverter(data) {
  this.data = data;
}

XmlConverter.prototype.toXml = function () {
  return js2xml('testsuites', this.data);
};

module.exports = XmlConverter;

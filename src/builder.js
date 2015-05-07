var XmlConverter = require('./xml_converter');

function Builder() {
  this.data = {};
}

Builder.prototype.build = function () {
  return new XmlConverter(this.data).toXml();
};

module.exports = Builder;

var Builder = require('./builder');
var Factory = require('./factory');

function wireBuilder() {
  return new Builder(new Factory());
}

module.exports = wireBuilder;

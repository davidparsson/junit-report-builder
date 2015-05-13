var Factory = require('./factory');

function wireBuilder() {
  return new Factory().newBuilder();
}

module.exports = wireBuilder;

var Factory = require('./factory');

function createBuilder() {
  return new Factory().newBuilder();
}

module.exports.createBuilder = createBuilder;

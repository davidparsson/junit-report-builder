var js2xml = require('js2xmlparser');

function Builder() {
  this.data = {};
}

Builder.prototype.build = function () {
  return js2xml('testsuite', this.data);
};

module.exports = Builder;

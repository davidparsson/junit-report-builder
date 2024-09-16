// .markdown-doctest-setup.js
module.exports = {
  require: {
    'junit-report-builder': require('./dist/index.js'),
  },
  globals: {
    builder: require('./dist/index.js'),
  },
};

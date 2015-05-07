module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    jasmine_node: {
      unitTest: ['spec/']
    }
  });

  grunt.registerTask('default', ['unitTest']);
  grunt.registerTask('unitTest', ['jasmine_node:unitTest']);
}

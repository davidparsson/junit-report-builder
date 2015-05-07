module.exports = (grunt) ->
  require('jit-grunt')(grunt)

  grunt.initConfig
    jasmine_nodejs:
      options:
        specNameSuffix: ['Spec.js', 'Spec.coffee']
      test:
        specs: ['spec/**']
    watch:
      javaScript:
        files: ['index.js', 'spec/**/*.js']
        tasks: ['test']
      coffeeScript:
        files: ['spec/**/*.coffee']
        tasks: ['test']

  grunt.registerTask 'default', ['test']
  grunt.registerTask 'test', ['jasmine_nodejs:test']
  grunt.registerTask 'tdd', ['test', 'watch']

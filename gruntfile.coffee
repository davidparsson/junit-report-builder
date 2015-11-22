module.exports = (grunt) ->
  require('jit-grunt')(grunt)

  require('time-grunt')(grunt) if grunt.option 'time'

  grunt.initConfig
    jasmine_nodejs:
      options:
        specNameSuffix: ['Spec.js', 'Spec.coffee']
      test:
        specs: ['spec/**']
    watch:
      javaScript:
        files: ['src/**/*.js', 'spec/**/*.js']
        tasks: ['jshint', 'test']
        options:
          atBegin: true
      coffeeScript:
        files: ['spec/**/*.coffee']
        tasks: ['test']
      config:
        files: ['gruntfile.coffee']
        options:
          reload: true
      testResources:
        files: ['spec/**/*.xml']
        tasks: ['test']
    jshint:
      javaScript: ['src/**/*.js', 'spec/**/*.js']

  grunt.registerTask 'default', ['jshint', 'test']
  grunt.registerTask 'test', ['jasmine_nodejs:test']
  grunt.registerTask 'tdd', ['watch']

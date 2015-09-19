module.exports = (grunt) ->
  require('jit-grunt') grunt,
    jsdoc2md: 'grunt-jsdoc-to-markdown'

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
    jshint:
      javaScript: ['src/**/*.js', 'spec/**/*.js']
    jsdoc2md:
      api:
        src: ['src/*.js']
        dest: 'API.md'

  grunt.registerTask 'default', ['jshint', 'test']
  grunt.registerTask 'test', ['jasmine_nodejs:test']
  grunt.registerTask 'tdd', ['watch']

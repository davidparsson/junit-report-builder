module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  if (grunt.option('time')) {
    require('time-grunt')(grunt);
  }

  grunt.initConfig({
    jasmine_nodejs: {
      options: {
        specNameSuffix: ['Spec.js', 'Spec.coffee'],
      },
      test: {
        specs: ['spec/**'],
      },
    },
    watch: {
      javaScript: {
        files: ['src/**/*.js', 'spec/**/*.js'],
        tasks: ['jshint', 'test'],
        options: {
          atBegin: true,
        },
      },
      coffeeScript: {
        files: ['spec/**/*.coffee'],
        tasks: ['test'],
      },
      config: {
        files: ['gruntfile.js'],
        options: {
          reload: true,
        },
      },
      testResources: {
        files: ['spec/**/*.xml'],
        tasks: ['test'],
      },
    },
    jshint: {
      javaScript: ['src/**/*.js', 'spec/**/*.js'],
      options: {
        esversion: 8,
      },
    },
  });

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('test', ['jasmine_nodejs:test']);
  grunt.registerTask('tdd', ['watch']);
};

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    mochacli: {
      options: {
        timeout: 3000,
        ui: 'bdd',
        reporter: 'spec'
      },
      lib: {
        src: 'test/**/*_test.js',
        options: {
          reporter: 'nyan'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'test']
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', 'mochacli:lib');
  grunt.registerTask('default', ['jshint', 'test']);
};

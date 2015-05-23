'use strict';

module.exports = function(grunt) {

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        debug: true,
        transform: ['reactify', 'envify']
      },
      dev: {
        options: {
          alias: ['react:']  // Make React available externally for dev tools
        },
        src: ['app/js/app.js'],
        dest: 'app/js/bundle.js'
      },
      production: {
        options: {
          debug: false
        },
        src: '<%= browserify.dev.src %>',
        dest: 'app/js/bundle.js'
      }
    },
    sass: {
      dev: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'app/css/app.css': 'app/scss/app.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'app/js/**/*.js',
          '!app/js/bundle.js'
        ],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['app/scss/**/*.scss'],
        tasks: ['sass:dev']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['sass:dev', 'watch']);
};
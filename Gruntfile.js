'use strict';

var packageJson = require('./package.json')

module.exports = function(grunt) {

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-electron');
  grunt.loadNpmTasks('grunt-electron-installer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev  : { 'NODE_ENV' : 'development' },
      dist : { 'NODE_ENV' : 'production' }
    },
    clean: {
      dist: ['dist/*'],
    },
    browserify: {
      options: {
        transform: ['reactify', 'envify']
      },
      dev: {
        options: {
          browserifyOptions: { debug : true },
          watch: 'watch',
          alias: ['react:']  // Make React available externally for dev tools
        },
        src: ['app/js/app.js'],
        dest: 'app/js/bundle.js'
      },
      dist: {
        src: '<%= browserify.dev.src %>',
        dest: 'app/js/bundle.js'
      }
    },
    sass: {
      dev: {
        options: { outputStyle: 'expanded' },
        files: {
          'app/css/app.css': 'app/scss/app.scss'
        }
      },
      dist: {
        options: { outputStyle: 'compressed' },
        files: {
          'app/css/app.css': 'app/scss/app.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['app/scss/**/*.scss'],
        tasks: ['sass:dev']
      }
    },
    electron: {
      options: {
        name    : 'Cumulus',
        dir     : '.',
        out     : 'dist',
        version : '0.31.2',
        prune   : true
      },
      osx: {
        options: {
          icon            : 'cumulus.icns',
          platform        : 'darwin',
          arch            : 'x64',
          // ignore          : 'node_modules/',
          'app-version'   : packageJson.version,
          'app-bundle-id' : 'com.gillesdemey.cumulus'
        }
      },
      windows: {
        options: {
          icon     : 'cumulus.ico',
          platform : 'win32',
          arch     : 'all',
          asar     : true
        }
      }
    },
    'create-windows-installer': {
      options: {
        authors: 'Cumulus Team',
        exe: 'cumulus.exe'
      },
      x64: {
        appDirectory: 'dist/Cumulus-win32-x64',
        outputDirectory: 'dist/installer-win32-x64'
      },
      ia32: {
        appDirectory: 'dist/Cumulus-win32-ia32',
        outputDirectory: 'dist/installer-win32-ia32'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['env:dev' ,'browserify:dev', 'sass:dev', 'watch']);
  grunt.registerTask('build',   ['env:dist', 'clean:dist', 'browserify:dist', 'sass:dist']);
  grunt.registerTask('package:osx', ['build', 'electron:osx']);
  grunt.registerTask('package:windows', ['build', 'electron:windows', 'create-windows-installer']);
};
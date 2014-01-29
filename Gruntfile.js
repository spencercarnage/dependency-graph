var matchdep = require('matchdep');

module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      app: {
        files: {
          'public/js/build/app.js': 'public/js/src/app.js'
        }
      },
      test: {
        files: {
          'public/js/build/tests/app-tests.js': 'public/js/tests/app-tests.js'
        }
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },
      views: {
        files: [
          'public/js/build/**/*.js',
          'views/**/*.ejs'
        ],
        options: {
          livereload: true
        }
      },
      app: {
        files: [
          'public/js/src/**/*.js'
        ],
        tasks: ['browserify:app'],
      },
      testApp: {
        files: [
          'public/js/tests/app-tests.js',
          'public/js/tests/**/*.js',
          'public/js/src/**/*.js'
        ],
        tasks: ['browserify:test'],
      },
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['watch']);
};

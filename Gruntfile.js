var matchdep = require('matchdep');

module.exports = function (grunt) {
  grunt.initConfig({
    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'min'
      },
      backEnd: ['tests/**/*.js'],
      frontEnd: ['public/js/tests/**/*.js']
    },
    // This is throwing weird errors so resorting to command line by
    // running 'npm run watch'
    //watchify: {
    //  app: {
    //    src: './public/js/src/**/*.js',
    //    dest: './public/js/build/app.js'
    //  }
    //},

    watch: {
      app: {
        files: 'public/js/build/app.js',
        options: {
          livereload: true
        }
      },
      mochaFrontEnd: {
        files: ['public/js/tests/**/*.js'],
        tasks: ['mochacli:frontEnd']
      },
      mochaBackEnd: {
        files: ['tests/**/*.js'],
        tasks: ['mochacli:backEnd']
      },
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['watch']);
};

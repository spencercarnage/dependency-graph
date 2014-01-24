var matchdep = require('matchdep');

var globalConfig = {
  js: {
    srcDir: 'public/js/src/',
    testDir: 'public/js/tests/',
    srcFile: '',
    buildFile: '',
    testFile: ''
  }
};

module.exports = function (grunt) {
  grunt.initConfig({
    globalConfig: globalConfig,
    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'min'
      },
      backEnd: ['tests/**/*.js'],
      //frontEnd: ['public/js/tests/**/*-tests.js'],
      singleFile: {
        src: ['<%= globalConfig.js.testFile %>']
      }
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
      grunt: {
        files: ['Gruntfile.js']
      },
      app: {
        files: 'public/js/build/app.js',
        options: {
          livereload: true
        }
      },
      mochaFrontEnd: {
        files: ['public/js/tests/**/*.js','public/js/src/**/*.js'],
        tasks: ['mochacli:singleFile'],
        options: {
          spawn: false
        }
      },
      mochaBackEnd: {
        files: ['tests/**/*.js'],
        tasks: ['mochacli:backEnd']
      },
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['watch']);

  var jsFileRE = new RegExp(globalConfig.js.srcDir);
  var jsTestFileRE = new RegExp(globalConfig.js.testDir); 

  /**
   * On the watch event, we check to see if we are changing a browserify js
   * file. If so, we update the globalConfig object which is what the
   * browserify and uglify tasks are using to build their respective files. We
   * use the 'once' method so that we do not add additional 'watch' events upon
   * subsequent reloads of the Gruntfile.js.
   */
  grunt.event.on('watch', function (action, filepath, target) {
    if ((action === 'changed' || action === 'added') && 
        (jsFileRE.test(filepath) || jsTestFileRE.test(filepath))) {

      console.log('here');

      if (filepath.match(/-tests.js/)) {
        globalConfig.js.srcFile = filepath
                                    .replace('tests/', 'src')
                                    .replace('-tests.js', '.js');

        globalConfig.js.buildFile = filepath
                                      .replace('tests/', 'build/')
                                      .replace('-tests.js', '.js');
                            
        globalConfig.js.testFile = filepath;
      } else {
        globalConfig.js.srcFile = filepath;
        globalConfig.js.buildFile = filepath.replace('src/', 'build/');
        globalConfig.js.testFile = filepath
                                      .replace('src/', '/tests/')
                                      .replace('.js', '-tests.js');
      }
    }
  });
};

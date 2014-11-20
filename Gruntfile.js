module.exports = function(grunt) {

  grunt.initConfig({
    karma: {
      unit: {
        options: {
          basePath: '',
          frameworks: ['jasmine'],
          files: [
            'https://code.angularjs.org/1.3.3/angular.js',
            'https://code.angularjs.org/1.3.3/angular-mocks.js',
            'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.js',
            'index.js',
            'test/*.js'
          ],
          browsers: ['Chrome'],
          singleRun: true
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-karma');
  
};

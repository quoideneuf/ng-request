module.exports = function(grunt) {

  grunt.initConfig({
    karma: {
      unit: {
        options: {
          basePath: '',
          frameworks: ['jasmine'],
          files: [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.6/angular.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.6/angular-mocks.js',
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

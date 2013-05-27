module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        coffee: {
            main: {
                files: {'build/deferDat.js' : 'src/deferDat.coffee'}
            }
        },
        jshint: {
            all: ['build/*.js']
        }
    });
    
    // Lib tasks.
    //grunt.loadNpmTasks('grunt-jasmine-runner');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', ['coffee','jshint']);

};
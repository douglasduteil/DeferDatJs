module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        coffee: {
            main: {
                src: ['src/*.coffee'],
                dest : 'build'
            }
        },
        watch : {
            files: [ '<config:coffee.main.src>'],
            tasks: 'coffee lint'
        },
        lint: {
            all: ['build/*.js']
        }
    });
    
    // Lib tasks.
    //grunt.loadNpmTasks('grunt-jasmine-runner');
    grunt.loadNpmTasks('grunt-coffee');

    // Default task.
    grunt.registerTask('default', 'coffee lint');

    // Travis CI task.
    grunt.registerTask('travis', 'coffee lint');
};
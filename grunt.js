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


    grunt.registerTask('test', 'run tests (make sure server task is run first)', function () {
        var done = this.async();
        grunt.utils.spawn({
            cmd: process.platform === 'win32' ? 'testacular.cmd' : 'testacular',
            args: process.env.TRAVIS ? ['start', 'test/test-config.js', '--single-run', '--no-auto-watch', '--reporter=dots', '--browsers=Firefox'] : ['run']
        }, function (error, result, code) {
            if (error) {
                grunt.warn("Make sure the testacular server is online: run `grunt server`.\n" +
                    "Also make sure you have a browser open to http://localhost:8080/.\n" +
                    error.stdout + error.stderr);
                //the testacular runner somehow modifies the files if it errors(??).
                //this causes grunt's watch task to re-fire itself constantly,
                //unless we wait for a sec
                setTimeout(done, 1000);
            } else {
                grunt.log.write(result.stdout);
                done();
            }
        });
    });
};
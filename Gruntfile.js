module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            scripts: {
                files: [
                    'lib/*.js',
                    'test/*.js'
                ],
                tasks: ['mochaTest'],
                options: {
                    spawn: false,
                },
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', 'mochaTest');
};
'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    'window': true
                }
            },
            files: {
                src: ['app/ui/src/**/*.js']
            }
        },

        watch: {
            scripts: {
                files: ['app/ui/src/**/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            }
        },

        uglify: {
            target: {
                files: {
                    'app/ui/dist/app.min.js': [
                        'app/ui/src/**/*.js'
                    ]
                }
            }
        },

        less: {
            dev: {
                options: {

                },
                files: {
                    'app/ui/dist/app.css': 'app/ui/src/**/*.less'
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    'app/ui/dist/app.min.css': 'app/ui/src/**/*.less'
                }
            }
        },

        concat: {
            dist: {
                src: ['app/ui/src/**/*.js'],
                dest: 'app/ui/dist/app.js',
            },
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'less:dev']);
    grunt.registerTask('build', ['jshint', 'uglify', 'less:prod']);

};

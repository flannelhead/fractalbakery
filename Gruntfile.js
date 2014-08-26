module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            build: {
                files: {
                    'fractalbakery.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/angular/angular.js',
                        'src/main.js',
                        'src/fractalrenderer.js',
                        'src/fractalviewer.js'
                    ],

                    'renderworker.js': [
                        'src/complex.js',
                        'src/complexpolynomial.js',
                        'src/newton.js',
                        'src/renderer.js',
                        'src/renderworker.js'
                    ]
                }
            }
        },

        uglify: {
            build: {
                options: {
                    compress: {
                        dead_code: true,
                        global_defs: {
                            'PRODUCTION': true
                        }
                    },
                    preserveComments: 'some'
                },

                files: {
                    'fractalbakery.min.js': ['fractalbakery.js'],
                    'renderworker.min.js': ['renderworker.js']
                }
            }
        },

        cssmin: {
            build: {
                files: {
                    'fractalbakery.min.css': [
                        'bower_components/pure/pure.css',
                        'src/fractalviewer.css',
                        'src/fractalbakery.css'
                    ]
                }
            }
        },

        targethtml: {
            build: {
                files: {
                    'index.html': 'src/index.html'
                }
            }
        },

        inline_angular_templates: {
            build: {
                options: {
                    base: 'src'
                },
                files: {
                    'index.html': ['src/fractalviewer.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-inline-angular-templates');

    grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'targethtml',
        'inline_angular_templates']);
};


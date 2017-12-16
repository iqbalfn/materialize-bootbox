module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        babel: {
            options: {
                sourceMap: false,
                minified: true,
                presets: ['env']
            },
            dist: {
                files: {
                    'dist/mzbox.es5.js': 'dist/mzbox.js'
                }
            }
        },
        
        concat: {
            default: {
                options: {
                    separator: ';\n',
                    banner: '(function(window, $){\n"use strict";\n',
                    footer: '\n})(window, cash);'
                },
                files: {
                    'dist/mzbox.js': [
                        'src/buttons.js',
                        'src/option.js',
                        'src/translation.js',
                        
                        'src/id.js',
                        'src/get-args.js',
                     
                        'src/box.js',
                     
                        'src/mzbox.js'
                    ]
                }
            }
        },
        
        copy: {
            default: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: 'mzbox.min.js',
                        dest: 'docs/js/'
                    }
                ]
            }
        },
        
        pug: {
            default: {
                options: {
                    pretty: true
                },
                files: {
                    'docs/index.html': 'docs/pug/index.pug'
                }
            },
            dist: {
                options: {
                    pretty: false
                },
                files: {
                    'docs/index.html': 'docs/pug/index.pug'
                }
            }
        },
        
        uglify: {
            dist: {
                options: {
                    compress: true,
                    report: 'gzip',
                    preserveComments: false
                },
                files: {
                    'dist/mzbox.min.js': 'dist/mzbox.es5.js'
                }
            }
        },
        
        watch: {
            files: ['src/*.js', 'docs/pug/*.pug'],
            tasks: ['concat', 'pug:default']
        }
    });
    
    grunt.registerTask('dist', [
        'concat:default',
        'babel:dist',
        'uglify:dist',
        'pug:dist',
        'copy:default'
    ]);
};
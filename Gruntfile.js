module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        babel: {
            options: {
                sourceMap: false,
                minified: true,
                presets: ['@babel/preset-env']
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

                        'src/html.js',
                     
                        'src/box.js',
                     
                        'src/mzbox.js'
                    ]
                }
            }
        },
        
        copy: {
            docs: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: 'mzbox.js',
                        dest: 'docs/js/'
                    }
                ]
            },
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

        usebanner: {
            dist: {
                options: {
                    banner: [
                        '/*!',
                        ' * Materialize Bootbox v<%= pkg.version %> (<%= pkg.homepage %>)',
                        ' * Copyright 2017-2020 Iqbal Fauzi',
                        ' * MIT License (https://raw.githubusercontent.com/iqbalfn/materialize-bootbox/master/LICENSE)',
                        ' */'
                    ].join("\n")
                },
                files: {
                    src: [
                        'dist/mzbox.js',
                        'dist/mzbox.min.js'
                    ]
                }
            }
        },
        
        watch: {
            files: ['src/*.js', 'docs/pug/*.pug'],
            tasks: ['concat', 'pug:default', 'copy:docs']
        }
    });
    
    grunt.registerTask('dist', [
        'concat:default',
        'babel:dist',
        'uglify:dist',
        'usebanner:dist',
        'pug:dist',
        'copy:docs',
        'copy:default'
    ]);
};
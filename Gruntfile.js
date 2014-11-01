module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['./dest/']
        },

        includes: {
            build: {
                cwd: './src/',
                src: ['*.user.js'],
                dest: './dest/'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                './src/habr-comments-filter.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-includes');

    grunt.registerTask('build', ['clean', 'jshint', 'includes']);
};

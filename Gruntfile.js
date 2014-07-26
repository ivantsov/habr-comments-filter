module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['./src/build/']
        },

        includes: {
            build: {
                cwd: './src/',
                src: ['*.user.js'],
                dest: './src/build/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-includes');

    grunt.registerTask('build', ['clean', 'includes']);
};

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ],
        files: [
            './bower_components/jquery/dist/jquery.js',
            './bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            './src/**/*.js',
            './src/**/*.html',
        ],
        exclude: [
            './src/*.user.js'
        ],
        preprocessors: {
            './*.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: './coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};

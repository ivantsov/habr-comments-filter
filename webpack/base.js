const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const extractTextPlugin = new ExtractTextPlugin('styles.css');

module.exports = {
  entry: ['./src/content-script/index.js'],
  output: {
    path: path.resolve('./dist/content-script'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader']
    }, {
      test: /\.css/,
      loader: extractTextPlugin.extract([
        'css-loader?modules&importLoaders=1&localIdentName=[hash:base64:10]'
      ])
    }]
  },
  plugins: [
    extractTextPlugin,
    new CopyPlugin([{
      from: 'src',
      to: path.resolve('dist'),
      ignore: [
        'content-script/**/*'
      ]
    }])
  ]
};

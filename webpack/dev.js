const baseConfig = require('./base');

module.exports = Object.assign({}, baseConfig, {
  watch: true,
  devtool: 'eval'
});

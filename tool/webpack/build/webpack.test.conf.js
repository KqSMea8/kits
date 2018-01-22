// This is the webpack config used for unit tests.
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config')
let baseConfig = require('./webpack.base.conf')

delete baseConfig.entry
const ys = {
  assert: function() {},
  error: function() {},
  info: function() {},
  log: function() {},
  success: function() {},
  trace: function() {},
  warning: function() {},
}
const webpackConfig = merge(baseConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  devtool: config.test.sourceMap ? '#inline-source-map' : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.test.env,
      ys: ys,
    }),
  ],
})

module.exports = webpackConfig

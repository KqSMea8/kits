const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('../config').demo
const baseWebpackConfig = require('./webpack.base.conf')

baseWebpackConfig.entry.nsp = './demo/main.js'
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/demo-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  // cheap-module-eval-source-map is faster for development
  // devtool: '#cheap-module-eval-source-map',
  output: {
    path: config.assetsRoot,
    publicPath: config.publicPath,
  },
  devtool: config.sourceMap,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.env
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../demo/')
      },
    ]),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
  ]
})

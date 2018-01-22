const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')
const env = process.env.NODE_ENV === 'testing' ?
  require('../config/test.env') :
  config.build.env

let webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.sourceMap ? 'source-map' : false,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig

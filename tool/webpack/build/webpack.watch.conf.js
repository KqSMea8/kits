const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config')
const baseWebpackConfig = process.env.WATCH_ENV === 'happy'
  ? require('./webpack.happy.conf')
  : require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  devtool: false, // no source-map
  profile: true,
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
  },
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: "mock",
    __dirname: "mock",
    setImmediate: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.watch.env
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
})

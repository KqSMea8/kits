const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const config = require('../config')

const projectRoot = path.resolve(__dirname, '../')

const configuration = {
  entry: {
    tool: ['moment', 'toastr', 'validator', 'lodash', 'core-js',
      'vuex', 'vue-router'],
    echart: ['echarts/dist/echarts.min.js'],
    d3: [
      'd3-axis',
      'd3-color',
      'd3-context-menu',
      'd3-drag',
      'd3-force',
      'd3-hierarchy',
      'd3-interpolate',
      'd3-path',
      'd3-quadtree',
      'd3-random',
      'd3-scale',
      'd3-selection',
      'd3-shape',
      'd3-timer',
      'd3-transition',
      'd3-zoom',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../public/dll'),
    publicPath: path.resolve(config.assetsPublicPath, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../public/dll', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /cn-zh/
    ),
    new ProgressBarPlugin({
      format: '  dll build => :msg [:bar]  ' + chalk.green.bold(':percent')
        + chalk.yellow.bold('  ( :elapsed s )'),
      clear: false,
      incomplete: '-',
      width: 30,
      }),
  ],
}

module.exports = configuration

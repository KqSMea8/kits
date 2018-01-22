const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const HappyPack = require('happypack')
const config = require('../config')

const projectRoot = path.resolve(__dirname, '../')

const cssLoader = ExtractTextPlugin.extract({
  use: [
    {
      loader: 'happypack/loader?id=css',
    },
  ],
  fallback: 'vue-style-loader'
})

const lessLoader = ExtractTextPlugin.extract({
  use: [
    'happypack/loader?id=css',
    'happypack/loader?id=less',
  ],
  fallback: 'vue-style-loader'
})

const preLoader = [
  {
    loader: 'happypack/loader?id=eslint',
  },
]

const rules = [
  {
    test: /\.(js|vue)$/,
    exclude: /node_modules/,
    enforce: 'pre',
    use: preLoader,
  },
  {
    test: /\.vue$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'vue-loader',
        options: {
          loaders: {
            css: cssLoader,
            less: lessLoader,
            js: 'happypack/loader?id=babel',
          },
          postcss: {
            plugins: [
              require('postcss-cssnext')(),
            ],
          }
       }
      }
    ]
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'happypack/loader?id=babel',
  },
  {
    test: /\.yaml$/,
    use: [
      'json-loader',
      'yaml-loader',
    ]
  },
  {
    test: /\.html$/,
    loader: 'vue-html-loader',
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]',
        }
      },
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]',
        }
      },
    ]
  }
]

const configuration = {
  entry: {
    nsp: './src/main.js',
    report: './src/report.js',
    vendor: [
      'axios',
      'cidr-js',
      'bootstrap',
      'd3',
      'd3-context-menu',
      'd3-tip',
      'g2',
      'ip-subnet-calculator',
      'jquery',
      'js-cookie',
      'lodash',
      'moment',
      'qs',
      'toastr',
      'validator',
      'vue',
      'vue-focus',
      'vue-resource',
      'vue-router',
      'vuex',
    ],
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../node_modules'),
      'node_modules',
    ],
    extensions: ['.js', '.vue', '.css', '.json', '*'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'nsp': path.resolve(__dirname, '../'),
      'src': path.resolve(__dirname, '../src'),
      'css': path.resolve(__dirname, '../src/assets/css'),
      'images': path.resolve(__dirname, '../src/assets/images'),
      'lib': path.resolve(__dirname, '../src/lib'),
      'common': path.resolve(__dirname, '../src/common'),
      'business': path.resolve(__dirname, '../src/business'),
      'api': path.resolve(__dirname, '../src/api'),
      'views': path.resolve(__dirname, '../src/views'),
      'components': path.resolve(__dirname, '../src/components'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
    }
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: rules,
  },
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      disable: false,
      allChunks: true,
    }),
    new ProgressBarPlugin({
      format: '  build => :msg [:bar]  ' + chalk.green.bold(':percent')
        + chalk.yellow.bold('  ( :elapsed s )'),
      clear: false,
      incomplete: '-',
      width: 30,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash',
    }),
    new HappyPack({
      id: 'babel',
      loaders: [ 'babel-loader?cacheDirectory=true' ],
    }),
    new HappyPack({
      id: 'css',
      cache: false,
      loaders: [ 'css-loader?importLoaders=1' ],
    }),
    new HappyPack({
      id: 'less',
      cache: false,
      loaders: [ 'less-loader' ],
    }),
    new HappyPack({
      id: 'eslint',
      cache: false,
      loaders: [{
        path: 'eslint-loader',
        query: {
          formatter: require('eslint-formatter-linux')
        }
      }],
    }),
  ],
}

module.exports = configuration

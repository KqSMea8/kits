const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const config = require('../config')
const dllConfig = require('./webpack.dll.conf')

const projectRoot = path.resolve(__dirname, '../')

const cssLoader = ExtractTextPlugin.extract({
  use: [
    {
      loader: 'css-loader',
      options: {
        import: true,
        importLoaders: true,
      }
    },
    {
      loader: 'postcss-loader',
      options: {}
    }
  ],
  fallback: 'vue-style-loader'
})

const lessLoader = ExtractTextPlugin.extract({
  use: [
    {
      loader: 'css-loader',
      options: {
        import: true,
        importLoaders: true,
      }
    },
    'less-loader',
  ],
  fallback: 'vue-style-loader'
})

const preLoader = [
  {
    loader: 'eslint-loader',
    options: {
      formatter: require('eslint-formatter-linux'),
    }
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
          },
        }
      }
    ]
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.yaml$/,
    use: [
      'json-loader',
      'yaml-loader',
    ]
  },
  {
    test: /\.less$/,
    use: lessLoader,
  },
  {
    test: /\.css$/,
    use: cssLoader,
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
    deepflow: './src/main.js',
    login: './src/login.js',
    report: './src/report.js',
    offline: './src/offline.js',
    flowDetail: './src/flowDetail.js',
    performance: './src/performance.js',
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
      'echarts': 'echarts/dist/echarts.min.js',
      'vis': 'vis/dist/vis.min.js',
      'element-ui': 'element-ui/lib/index.js',
      'nsp': path.resolve(__dirname, '../'),
      'demo': path.resolve(__dirname, '../demo'),
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
      _: 'lodash',
      $: 'jquery',
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerHost: '0.0.0.0',
    // }),
  ],
}

Object.keys(dllConfig.entry).forEach(item => {
  configuration.plugins.push(
    new webpack.DllReferencePlugin({
      manifest: require(`../public/dll/${item}-manifest.json`)
    })
  )
})

module.exports = configuration

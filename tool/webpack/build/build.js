require('./check-versions')()
process.env.NODE_ENV = 'production'
const path = require('path')
const ora = require('ora')
const exec = require('child_process').exec
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const staticPath = path.resolve(__dirname, '../static')
const publicPath = path.resolve(__dirname, '../public/*')
const binPath = path.resolve(__dirname, '../bin')

// remove the old assets code
exec('rm -rf ' + staticPath + '/*')
exec('sh ' + binPath + '/version.sh', function() {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      console.log('\n\n')
      process.exit(1)
    }
    if (stats.hasErrors()) {
      console.error(stats.compilation.errors)
      console.log('\n\n')
      process.exit(1)
    }
    if (stats.hasWarnings()) {
      console.warn(stats.compilation.warnings)
      console.log('\n\n')
      process.exit(1)
    }

    exec('\\cp -r ' + publicPath + ' ' + staticPath)
    const statsString = stats.toString({
      colors: true,
      chunks: false,
      chunkModules: false,
      timings: true,
      assets: true,
    })
    console.log(statsString)
    console.log('\n\n')
  })
})

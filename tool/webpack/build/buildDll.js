require('./check-versions')()
process.env.NODE_ENV = 'production'
const path = require('path')
const ora = require('ora')
const exec = require('child_process').exec
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.dll.conf')

const dllPath = path.resolve(__dirname, '../public/dll')
exec('rm -rf ' + dllPath + '/*')
webpack(webpackConfig, function(err, stats) {
  if (err) {
    throw err
  }
  const statsInfo = stats.toString({
    colors: true,
    chunks: false,
    chunkModules: false,
    timings: true,
    assets: true,
  })
  process.stdout.write(statsInfo)
  process.stdout.write('\n\n')
})

process.env.NODE_ENV = 'development'
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const chalk = require('chalk')
const ora = require('ora')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.watch.conf')
const config = require('../config')


// Record the number of compilation
let count = 1
const compiler = webpack(webpackConfig)
const watcher = compiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
    // pass a number to set the polling interval
}, function(err, stats) {
  var statsInfo = stats.toString({
      colors: true,
      chunks: false,
      chunkModules: true,
      timings: true,
      assets: true,
    })
  process.stdout.write(chalk.blue.bold('***********compile summary*************\n') +
    statsInfo + '\n\nlast compile count is ' + chalk.green.bold('[ ' + count + ' ]') + ' => ' +
    chalk.yellow(new Date()) + chalk.blue.bold('\n**************************************\n')
  )
})

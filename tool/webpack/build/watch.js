require('./check-versions')()
process.env.NODE_ENV = 'development'
const iconv = require('iconv-lite')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.watch.conf')

const publicPath = path.resolve(__dirname, '../public/*')
const staticPath = path.resolve(__dirname, '../static')
const hotFiles = path.join(staticPath, '*hot-update*')
const shPath = path.resolve(__dirname, '../bin')
// remove the old assets code
exec('rm -rf ' + staticPath + '/*')
// launch server development environment
spawn('sh', [path.join(shPath, './launchEnv.sh')])
// Record the number of compilation
let count = 1
let scpProcess
webpack(webpackConfig, function(err, stats) {
  if (scpProcess) {
    scpProcess.kill()
  }
  exec('cp -rfn ' + publicPath + ' ' + staticPath)
  exec('rm -rf ' + hotFiles)
  const statsInfo = stats.toString({
      colors: true,
      chunks: false,
      chunkModules: true,
      timings: true,
      assets: true,
    })
  process.stdout.write(
    chalk.blue.bold('*********************  compile summary  ***********************\n')
    + statsInfo
    + '\n\ncompiled at ' + chalk.yellow(new Date())
    + chalk.green.bold('  [ ' + count + ' ]  ')
    + chalk.blue.bold('\n***************************************************************\n')
  )
  var babelErr = (statsInfo.indexOf('ERROR ') == -1  &&
    statsInfo.indexOf('Errors:') == -1) ? false :true
  if (err || babelErr) {
    process.stdout.write(
      chalk.red.bold('\n!!!!!!!!!!!!!! HAS  ERROR  !!!!!!!!!!!!!!!!\n' +
      (err ? err : '') + '\n\n'))
  } else {
    let scpNotError = true
    scpProcess = spawn('sh', [path.join(shPath, './scpToServer.sh'), count])
    scpProcess.stderr.on('data', function(data) {
      scpNotError = false
      process.stdout.write(chalk.red.bold(iconv.decode(new Buffer(data), 'gbk')))
    })
    scpProcess.stdout.on('data', function(data, t) {
      process.stdout.write(iconv.decode(new Buffer(data), 'gbk'))
    })
    scpProcess.on('close', function(code) {
      if(statsInfo.indexOf('WARNING') > 0 || statsInfo.indexOf('Warnings') > 0 ){
        process.stdout.write(
          chalk.yellow.bold('\n!!!!!!!!!!!  HAS  WARNING  !!!!!!!!!!!!!!!\n\n'))
      }
      if (code === 0 && scpNotError) {
        process.stdout.write(chalk.green.bold('\n>>>>   server is ok   <<<<\n\n'))
      }
    })
    count += 1
  }
})

require('./check-versions')()

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const config = require('../config').demo
const webpackConfig = require('./webpack.demo.conf')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.env.NODE_ENV)
}

// 读取.devrc文件中的 demo_server_port 字段作为服务器的启动端口
// 如果未配置则使用9000
const contentList = fs.readFileSync(path.resolve('.devrc'), 'utf8').split('\n')
let port = 9000
contentList.forEach(item => {
  let line = item.split('=')
  if (line[0] === 'demo_server_port') {
    port = line[1]
  }
})

// default port where dev server listens for incoming traffic
const host = config.host || '0.0.0.0'
const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
app.use(express.static(config.assetsRoot))

const uri = `http://:${host}:${port}`

devMiddleware.waitUntilValid(function () {
   console.log(chalk.green.bold('\n >> Listening at ' + uri + '\n\n'))
})

module.exports = app.listen(port, host, function (err) {
  if (err) {
    console.log(err)
    return
  }
})

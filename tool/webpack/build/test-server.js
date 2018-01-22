const fs = require('fs')
const path = require('path')
const express = require('express')
const chalk = require('chalk')
const config = require('../config')

// 读取.devrc文件中的 test_server_port 字段作为服务器的启动端口
// 如果未配置则使用9000
const contentList = fs.readFileSync(path.resolve('.devrc'), 'utf8').split('\n')
let port = 9000
contentList.forEach(item => {
  let line = item.split('=')
  if (line[0] === 'test_server_port') {
    port = line[1]
  }
})
const host = config.test && config.test.host || '0.0.0.0'
const reportPath = path.resolve(__dirname, '../test/report/lcov-report/')
const app = express()
const uri = `http://${host}:${port}`

process.stdout.write(
  chalk.green.bold(`\n>> open ${uri} checkout the report\n\n\n`)
)

// serve pure static assets
app.use(express.static(reportPath))

app.listen(port, host, function (err) {
  if (err) {
    console.log(err)
    return
  }
})

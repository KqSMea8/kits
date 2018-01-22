var merge = require('webpack-merge')
var devEnv = require('./watch.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})

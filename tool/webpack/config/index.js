// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  assetsRoot: path.resolve(__dirname, '../static/'),
  assetsPublicPath: '/public',
  build: {
    env: require('./prod.env'),
    sourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  watch: {
    env: require('./watch.env'),
    sourceMap: false
  },
  test: {
    env: require('./test.env'),
    sourceMap: true,
    host: '0.0.0.0',
  },
  demo: {
    env: require('./watch.env'),
    sourceMap: false,
    host: '0.0.0.0',
    publicPath: '/',
    assetsRoot: path.resolve(__dirname, '../demo/')
  }
}

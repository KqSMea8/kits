const dllConfig = require('../build/webpack.dll.conf')
const testConfig = require('../build/webpack.test.conf')
delete testConfig.entry

module.exports = function(config) {
  let files = [
    '../node_modules/babel-polyfill/dist/polyfill.js',
  ]
  Object.keys(dllConfig.entry).forEach(item => {
    files.push(`../public/dll/${item}.dll.js`)
  })
  files.push('./index.js')
  config.set({
    color: true,
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files,
    reporters: ['mocha', 'coverage', 'junit'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: testConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
    coverageReporter: {
      dir: './report',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' },
      ]
    },
    junitReporter: {
      outputDir: './report',
      outputFile: 'junit-report.xml',
      suite: 'models',
      useBrowserName: false,
    },
  })
}

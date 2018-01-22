import Vue from 'vue';

Vue.config.productionTip = false;

// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// you can also change this to match only the subset of files that
// you want coverage for.

// require all components files for coverage.
const components = require.context('components', true, /\.vue$/)
components.keys().forEach(components)

// require all common files for coverage.
const common = require.context('common', true, /\.js$/)
common.keys().forEach(common)

// require all api files for coverage.
const api = require.context('api', true, /\.js$/)
api.keys().forEach(api)

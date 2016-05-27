'use strict'

var env = process.env.NODE_ENV? process.env.NODE_ENV: 'development'
var config = require('./variables.json')[env]

module.exports = config
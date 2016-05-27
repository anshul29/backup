'use strict'

var router = require('express').Router()

var starHandler = require('./starHandler')
var respond = starHandler.respond

var params = {}

module.exports = router

router.use('*', function (request, response, next) {

	starHandler.paramBuilder(request, function (param) {
		params = param
	})

	next()

})

var elasticSearchInterface = require('../services/elasticSearch')

router.get('/fellows', (request, response) => {

	elasticSearchInterface.fellowAnalytics(null, params, (err, json)  => {
		respond(err, json, response)
	})

})
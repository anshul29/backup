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

var elasticSearch = require('../services/elasticSearch')

router.get('/', function (request, response) {

	params.params = request.params

	elasticSearch.search(null, params, (err, json) => {
		respond(err, json, response)
	})

})
'use strict'

var router = require('express').Router()

var starHandler = require('./starHandler')
var respond = starHandler.respond

var sendError = require('../models/errorHandler').sendError

var params = {}

module.exports = router

router.use('*', function (request, response, next) {

	starHandler.paramBuilder(request, function (param) {
		params = param
	})

	if((!params.authHeader.accessLevel) || (params.authHeader.accessLevel <= 10)) {
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})
	}

	else
		next()

})

var elasticSearch = require('../services/elasticSearch')

router.post('/candidate/:candidateId', function (request, response) {
	params.params = request.params
	elasticSearch.indexCandidate(null, params, function (err) {
		respond(err, null, response)
	})
})

router.post('/users/:type', (request, response) => {

	if((!params.authHeader.accessLevel) || (params.authHeader.accessLevel <= 20)) {
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})
	}

	params.params = request.params
	elasticSearch.buildMovement(err => {
		respond(err, null , response)
	})

})
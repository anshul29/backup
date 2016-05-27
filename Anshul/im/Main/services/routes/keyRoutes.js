'use strict'

var router = require('express').Router()

var starHandler = require('./starHandler')
var respond = starHandler.respond

var params = {}

module.exports = router

router.use('*', function (request, response, next) {

	starHandler.paramBuilder(request, function (param) {
		params = param
		next()
	})

})

var keyModel = require('../models/keyModel')
var sendError = require('../models/errorHandler').sendError

router.get('/scopes', function (request, response) {

	keyModel.getDetails(null, {authHeader: params.authHeader, query: 'scopes'}, function (err, scopes) {

		if(err)
			respond(err, null, response)

		else if(scopes) {

			let jsonBuilder = {
				scopes: scopes
			}

			respond(err, jsonBuilder, response)

		}
		
	})	

})

router.get('/gcmSenderId', function (request, response) {

	keyModel.getDetails(null, {authHeader: params.authHeader, query: 'gcmSenderId'}, function (err, gcmSenderId) {

		if(err)
			respond(err, null, response)

		else if(gcmSenderId) {

			let jsonBuilder = {
				gcmSenderId: gcmSenderId
			}

			respond(err, jsonBuilder, response)

		}

	})

})

router.put('/', function (request, response) {

	if((!params.authHeader.accessLevel) || (params.authHeader.accessLevel !== 99))
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})

	else
		keyModel.createKey(null, params, function (err) {
			respond(err, response)
		})
})

module.exports = router
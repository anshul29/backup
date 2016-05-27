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

var userModel = require('../models/userModel')

var sendError = require('../models/errorHandler').sendError

router.get('/publicDetails', function (request, response) {

	userModel.verifyUserToken(null, params.authHeader, function (err, email){

		if(err)
			respond(err, null, response)

		else if(email) {

			if((request.query.email) && (email.indexOf('teachforindia.org') > -1))
				email = request.query.email

			userModel.retrieveUserDetails(err, {email: email, query: 'publicDetails'}, function (err, publicDetails) {

				var jsonBuilder = {}

				if(publicDetails) {

					jsonBuilder = {
						publicDetails: publicDetails
					}

				}

				respond(err, jsonBuilder, response)
			})
		}
	})
})

router.get('/tokens', function (request, response) {
	userModel.refreshAccessToken(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.post('/sessions', function (request, response) {
	userModel.createUserSession(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.post('/gcmRegistrationTokens', function (request, response) {
	userModel.updateUser(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.use('*', function (request, response, next) {
	if((!params.authHeader.accessLevel) || (params.authHeader.accessLevel <= 20))
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})

	else
		next()
})

router.put('/', function (request, response) {

	if((params.body.hdBypass === 'true') && (params.authHeader.accessLevel <= 30))
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})

	else
		userModel.createUser(null, params, function (err) {
			respond(err, null, response)
		})
})

module.exports = router
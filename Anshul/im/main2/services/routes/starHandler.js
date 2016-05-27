'use strict'

const _ = require('lodash')

var starHandler = {}

starHandler.respond = function (err, jsonBuilder, response) {

	var finalJson = {}
	finalJson.errors = (err ? 'yes': 'no')

	if(err) {
		finalJson.errorCode = err.code? err.code: null
		finalJson.errorMessage = err.userMessage? err.userMessage: null
	}

	else if(jsonBuilder)
		_.merge(finalJson, jsonBuilder)
		// finalJson[jsonBuilder.key] = jsonBuilder.value

	response.header('Content-Type', 'application/json')
	response.send(finalJson)
}

starHandler.paramBuilder = function (request, callback) {

	let params = {}

	params.authHeader = request.authHeader
	params.params = request.params

	_.merge(params, request.query, request.body)

	switch(request.method) {
	case('GET'):
		params.query = request.query
		break
	case('POST'):
		params.body = request.body
		break
	case('PUT'):
		params.body = request.body
	}

	return callback(params)
}

module.exports = starHandler
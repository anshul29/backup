'use strict'

const router = require('express').Router()

const _ = require('lodash')

const starHandler = require('./starHandler')
const respond = starHandler.respond

let params = {}

module.exports = router

router.use('*', function (request, response, next) {

	starHandler.paramBuilder(request, function (param) {
		params = param
	})

	next()

})

const userModel = require('../models/userModel')

router.get('/', (request, response) => {

	params.email = params.authHeader.email
	params.query = []

	_.forEach(request.query, (value, key) => {params.query.push(key)})

	userModel.retrieveUserDetails(null, params, (err, json) => {
		respond(err, json, response)
	})

})
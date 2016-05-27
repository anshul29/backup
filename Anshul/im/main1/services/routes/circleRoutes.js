'use strict'

const router = require('express').Router()

const starHandler = require('./starHandler')
const respond = starHandler.respond

let params = {}

module.exports = router

router.use('*', function (request, response, next) {

	starHandler.paramBuilder(request, function (param) {
		params = param
		next()
	})

})

const circleModel = require('../models/circleModel')

router.use('/members', (request, response) => {
	circleModel.listMembers(null, params, (err, json) => {
		respond(err, json, response)
	})
})
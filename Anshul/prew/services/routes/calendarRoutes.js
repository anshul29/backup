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

var calendarModel = require('../models/calendarModel')

var sendError = require('../models/errorHandler').sendError

router.put('/events', function (request, response) {

	if(params.body.eventType === 'Leave')
		calendarModel.applyLeave(null, params, function (err, json) {
			respond(err, json, response)
		})

})

router.post('/events', function (request, response) {
	calendarModel.editEvent(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.get('/events', function (request, response) {
	calendarModel.retrieveEvents(null, params, function (err, json) {
			respond(err, json, response)
	})
})

router.get('/counters/leaveCounter', function (request, response) {
	calendarModel.retrieveCounters(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.get('/counter/leaveCounter', function (request, response) {
	calendarModel.retrieveCounters(null, params, function (err, json) {
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

	calendarModel.createCalendar(null, params, function (err) {
		respond(err, null, response)
	})
})

module.exports = router
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

var notificationModel = require('../models/notificationModel')

router.get('/', function (request, response) {
	notificationModel.retrieveNotifications(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.get('/counters', function (request, response) {
	notificationModel.retrieveCounters(null, params, function (err, json) {
		respond(err, json, response)
	})
})

router.post('/', function (request, response) {
	notificationModel.markRead(null, params, function (err, json) {
		respond(err, json, response)
	})
})
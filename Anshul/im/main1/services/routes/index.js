'use strict'

const constants = require('../configs/constants.json')

const config = require('../configs/config')
	, originWhitelist = config.cors.originWhitelist

const router = require('express').Router()

const cors = require('cors')

const _ = require('lodash')

const log = require('../server.js').routeLog

const keyModel = require('../models/keyModel')
	, userModel = require('../models/userModel')
	, competenciesModel = require('../models/competenciesModel')
	, errorHandler = require('../models/errorHandler')
	, sendError = errorHandler.sendError

const starHandler = require('./starHandler')
	, respond = starHandler.respond

const searchRoutes = require('./searchRoutes')
	, calendarRoutes = require('./calendarRoutes')
	, userRoutes = require('./userRoutes')
	, notificationRoutes = require('./notificationRoutes')
	, keyRoutes = require('./keyRoutes')
	, indexRoutes = require('./indexRoutes')
	, circleRoutes = require('./circleRoutes')
	, monitorRoutes = require('./monitorRoutes')

var logClass = request => ({
	'host': request.headers.host,
	'user-agent': request.headers['user-agent'],
	'method': request.method,
	'url': request.originalUrl,
	'ip': request.ip
})

router.options('*', cors({
	origin: (origin, callback) => {
		callback(null, (originWhitelist.indexOf(origin) > -1))
	}
}))

router.use('*', cors({
	origin: (origin, callback) => {
		callback(null, (originWhitelist.indexOf(origin) > -1))
	}
}), function (request, response, next) {

	let logObject = logClass(request)
	let startTime = process.hrtime()

	response.on('finish', function () {

		let responseTime = process.hrtime(startTime)
		logObject.responseTime = responseTime[0] * 1e9 + responseTime[1]

		log.trace(logObject)

	})

	let majorVersion = request.headers.version? request.headers.version.split('.')[0]: 0

	if(parseInt(majorVersion) !== 0)
		return sendError(1001, `expected ${majorVersion} to be 0`, err => {
			respond(err, null, response)
		})

	else {

		keyModel.verifyKey(null, request.headers, function (err, authHeader) {

			if(err)
				return respond(err, null, response)

			else {

				if((authHeader.token) && (authHeader.token.length === constants.user.apiAccessTokenLength)) {

					userModel.verifyUserToken(err, authHeader, (err, email) => {

						if(err)
							respond(err, null, response)

						else {
							authHeader.email = email
							request.authHeader = authHeader
							next()
						}

					})

				}

				else {
					request.authHeader = authHeader
					next()
				}

			}

		})

	}

})

router.use('/search', searchRoutes)
router.use('/calendar', calendarRoutes)
router.use('/user', userRoutes)
router.use('/circles', circleRoutes)
router.use('/notifications', notificationRoutes)
router.use('/key', keyRoutes)
router.use('/index', indexRoutes)
router.use('/monitor', monitorRoutes)

router.use('/competencies', (request, response) => {

	let params = {
		authHeader: request.authHeader
	}
	_.merge(params, request.query, request.body)

	competenciesModel.getCompetencies(null, params, (err, json) => {
		respond(err, json, response)
	})

})

router.post('/competencies', (request, response) => {

	let params = {
		authHeader: request.authHeader
	}
	_.merge(params, request.query, request.body)
	competenciesModel.updateCompetencies(null, params, err => {
		respond(err, null, response)
	})

})

router.get('/status', function (request, response) {
	respond(null, {status: 'All Good :)'}, response)
})

router.put('/error', function (request, response) {

	let params = {
		authHeader: request.authHeader
		, body: request.body
	}

	if(params.authHeader.accessLevel <= 50)
		sendError('Low access api key', 5004, function (err) {
			respond(err, null, response)
		})

	else
		errorHandler.insertRecords(null, params.body, function (err) {
			respond(err, response)
		})

})

module.exports = router
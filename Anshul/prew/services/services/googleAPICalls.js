'use strict'

const issuer = ['accounts.google.com', 'https://accounts.google.com']
	, config = require('../configs/config')

var keyModel = require('../models/keyModel')
var sendError = require('../models/errorHandler').sendError

var google = require('googleapis')
var OAuth2 = google.auth.OAuth2

var _ = require('lodash')
var async = require('async')

var googleAPICalls = {}
module.exports = googleAPICalls

googleAPICalls.retrieveHolidays = function (params, callback) {

	keyModel.getDetails(null, {authHeader: config.authHeader, query: 'all'}, function (err, keyRecord) {

		var oauth2Client = new OAuth2(keyRecord.clientId, keyRecord.clientSecret, keyRecord.redirectURI)

		var refresh_token = config.google.refresh_token

		oauth2Client.setCredentials({
			refresh_token: refresh_token
		})

		oauth2Client.refreshAccessToken(function (err) {

			if(err)
				return sendError(err, 2006, callback)

			else {

				async.parallel({

					holidays: function (callback) {

						let calendarParams = {
							calendarId: config.google.orgCalendarId
							, timeMin: params.timeMin
							, timeMax: params.timeMax
							, singleEvents: true
							, q: 'holiday Holiday'
						}
						let calendar = google.calendar({ version: 'v3', auth: oauth2Client, params: calendarParams})
						calendar.events.list(function (err, res) {

							if(err)
								return callback(err)

							let holidays = _.map(res.items, function(value) {
								return {
									date: value.start.date
									, description: value.summary
								}
							})

							return callback(err, holidays)
						})

					}

					, nonWorking: function (callback) {

						let calendarParams = {
							calendarId: config.google.orgCalendarId
							, timeMin: params.timeMin
							, timeMax: params.timeMax
							, singleEvents: true
							, q: 'Non-working'
						}
						let calendar = google.calendar({ version: 'v3', auth: oauth2Client, params: calendarParams})
						calendar.events.list(function (err, res) {

							if(err)
								return callback(err)

							let nonWorking = _.map(res.items, function(value) {
								return {
									date: value.start.date
									, description: value.summary
								}
							})

							return callback(err, nonWorking)
						})

					}
				}, function (err, results) {

					if(err)
						sendError(err, 2001, callback)

					let holidays = results.holidays.concat(results.nonWorking)
					return callback(err, holidays)

				})					

			}
		})

	})
				
}

googleAPICalls.verifyAuthCode = function (err, params, callback) {

	keyModel.getDetails(err, {authHeader: params.authHeader, query: 'all'}, function (err, keyRecord) {

		var oauth2Client = new OAuth2(keyRecord.clientId, keyRecord.clientSecret, keyRecord.redirectURI)

		oauth2Client.getToken(params.authCode, function (err, tokens) {
			if(err)
				return sendError(err, 2001, callback)
			else
				return callback(err, tokens)	// Tokens contains an access_token and an optional refresh_token
		})

	})

}

googleAPICalls.verifyIdToken = function (err, params, callback) {

	var oauth2 = google.oauth2({ version: 'v3'})
		, clientId = params.authHeader.clientId
		, azp = params.authHeader.azp
		, tokens = {id_token: params.id_token}

	oauth2.tokeninfo(tokens, function (err, response) {

		if(err || response.error_description){
			let error = JSON.stringify({
				err: err? err: null
				, errorDescription: response? response.error_description: null
			})
			return sendError(error, 2005, callback)
		}
		else if(!((issuer.indexOf(response.iss) > -1) && (response.aud === clientId) && ((response.azp === azp) || (response.azp === clientId))))
			return sendError(JSON.stringify(response), 2002, callback)
		else if(response.email || response.sub)
			return callback(err, response)
		else
			return sendError(err, 2007, callback)

	})

}

googleAPICalls.refreshAccessToken = function (err, params, callback) {

	keyModel.getDetails(err, {authHeader: params.authHeader, query: 'all'}, function (err, keyRecord) {

		if(err)
			return sendError(err, 3001, callback)

		var oauth2Client = new OAuth2(keyRecord.clientId, keyRecord.clientSecret)

		oauth2Client.setCredentials({
			refresh_token: params.refresh_token
		})

		oauth2Client.refreshAccessToken(function (err, tokens) {
			if(err)
				return sendError(err, 2006, callback)
			else
				callback(err, tokens)
		})
	})

}

googleAPICalls.retrieveBasicInfo = function (err, tokens, callback) {

	var oauth2Client = new OAuth2()
	oauth2Client.setCredentials(tokens)
	var oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client})

	oauth2.userinfo.v2.me.get({userId: 'me'}, function (err, response) {
		if(err)
			return sendError(err, 2004, callback)
		else
			return callback(err, response)
	})

}
'use strict'

const authHeaderTTL = 1*1*60*60
	, keyRecordTTL = 1*24*60*60
	, apiKeyLength = 16
	, clientIdLength = 72
	, redisDB = require('../configs/constants.json').redisDB.keyModel
	, errors = {
		noAuthHeader: 'No authorization header'
		, invalidAuthHeader: 'Invalid authorization header'
		, noKeyRecord: 'Warn: No keyRecord'
		, apiClientMismatch: 'Warn: apiKey and clientId did not match'
		, invalidKeyLength: 'Warn: apiKeyLength or clientIdLength invalid'
	}

var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var _ = require('lodash')

var sendError = require('../models/errorHandler').sendError

var redis = require('redis')
var redisClient = redis.createClient()
redisClient.on('error', function (err) {
	sendError(err, 3014)
})

redisClient.select(redisDB, function (err, redisResponse) {
	if(err || redisResponse !== 'OK')
		sendError(err, 5014)
})


var keySchema = new Schema({
	apiKey: {
		type: String
		, index: {
			unique: true,
			sparse: true
		}
		, trim: true
		, required: true
	}
	, clientId: {
		type: String
	}
	, clientSecret: {
		type: String
	}
	, gcmServerAPIKey: {
		type: String
	}
	, gcmSenderId: {
		type: String
	}
	, accessLevel: {
		type: Number
	}
	, redirectURI: {
		type: String
	}
	, azp: {
		type: String
	}
	, scopes: [String]
})

var keyModel = mongoose.model('key', keySchema)

var keyModelInterface = {}
module.exports = keyModelInterface

keyModelInterface.createKey = function (err, params, callback) {

	var keySet = new keyModel({
		apiKey: ''
		, clientId: ''
		, clientSecret: ''
		, redirectURI: ''
		, accessLevel: ''
	})

	keySet.save(function (err, keySet) {
		if(err)
			return sendError(err, 5001, callback)
		return callback(err, keySet)
	})

}

keyModelInterface.verifyKey = function (err, params, callback) {

	if(!_.isString(params.authorization))
		return sendError(errors.noAuthHeader, 5005, callback)

	else {

		let redisKey = params.authorization

		redisClient.hgetall(redisKey, function (err, redisResponse) {

			if((!err) && (redisResponse !== null))
				return callback(err, redisResponse)

			else {

				if(params.authorization.indexOf('Basic ') === -1)
					return sendError(errors.noAuthHeader, 5005, callback)

				else {

					let args = params.authorization.split('Basic ')[1]
					args = new Buffer(args, 'base64').toString('ascii')
					args = args.split(':')

					if(args.length < 2 || args.length > 3)
						return sendError(errors.invalidAuthHeader, 5005, callback)
					if((args[0].length !== apiKeyLength) || (args[1].length !== clientIdLength))
						return sendError(errors.invalidKeyLength, 5005, callback)

					else {

						let authHeader = {
							apiKey: args[0]
							, clientId: args[1]
							, token: null
						}
						if(args.length === 3)
							authHeader.token = args[2]

						keyModel.findOne({
							'apiKey': authHeader.apiKey
						}, function (err, keyRecord) {

							if(err)
								return sendError(err, 5001, callback)
							else if(!keyRecord)
								return sendError(errors.noKeyRecord, 5005, callback)
							else if(keyRecord.clientId !== authHeader.clientId)
								return sendError(errors.apiClientMismatch, 5005, callback)

							else{

								authHeader.accessLevel = keyRecord.accessLevel
								authHeader.azp = keyRecord.azp

								redisClient.hmset(redisKey, authHeader, function () {
									redisClient.expire(redisKey, authHeaderTTL)
								})

								return callback(err, authHeader)

							}
						})
					}

				}

			}
		})
	}
}

keyModelInterface.getDetails = function (err, params, callback) {

	var apiKey = params.authHeader.apiKey
		, clientId = params.authHeader.clientId
		, redisKey = apiKey + clientId
		, keyRecord = {}

	var respond = function () {

		switch(params.query){
		case('all'):
			return callback(err, keyRecord)
		case('scopes'):
			return callback(err, keyRecord.scopes)
		case('gcmServerAPIKey'):
			return callback(err, keyRecord.gcmServerAPIKey)
		case('gcmSenderId'):
			return callback(err, keyRecord.gcmSenderId)
		}

	}

	redisClient.hgetall(redisKey, function (err, redisResponse) {

		if((!err) && (redisResponse !== null)) {

			redisResponse.scopes = redisResponse.scopes.split(',')
			keyRecord = redisResponse
			respond()

		}

		else {

			keyModel.findOne({
				'clientId': params.authHeader.clientId
				, 'apiKey': params.authHeader.apiKey
			}, function (err, keyRec) {

				if(err)
					return sendError(err, 5001, callback)

				else if(keyRec) {

					redisClient.hmset(redisKey, keyRec.toJSON(), function (err) {
						if(!err) redisClient.expire(redisKey, keyRecordTTL)
					})
					keyRecord = keyRec
					respond()

				}

				else if(!keyRec)
					return sendError(errors.noKeyRecord, 5006, callback)				

			})
		}

	})
			
}
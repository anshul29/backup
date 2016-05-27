'use strict'

const errors = {
		tokenLength: 'tokens length mismatch for params: %s'
		, redisError: 'err: %s, redisResponse: %s'
		, refreshToken: 'no refresh_token'
		, hdMismatch: 'hd did not match for %s'
		, invalidInput: 'invalid input'
		, userNotFound: 'userRecord not found for %s'
		, gcmFail: 'no gcm success for %s'
		, accessTokenExpired: 'access token token expired'
	}
	, apiAccessTokenName = 'teachPIAccessToken'
	, apiRefreshTokenName = 'teachPIRefreshToken'
	, apiAccessTokenLength = 300
	, apiRefreshTokenLength = 280
	, accessTokenTTL = 1*24*60*60
	, hd = 'teachforindia.org'
	, encryptionKey = require('../configs/config').encryptionKey
	, redisDB = require('../configs/constants.json').redisDB.userModel

var _ = require('lodash')
var crypto = require('crypto')
var sprintf = require('sprintf')
var async = require('async')

var mongoose = require('mongoose'),
	Schema = mongoose.Schema

var sendError = require('./errorHandler').sendError
var googleAPICalls = require('../services/googleAPICalls')
var salesforceAPICalls = require('../services/salesforceAPICalls')

var redis = require('redis')
var redisClient = redis.createClient()
redisClient.on('error', function (err) {
	sendError(err, 3014)
})

redisClient.select(redisDB, function (err, redisResponse) {
	if(err || redisResponse !== 'OK')
		sendError(err, 5014)
})

var googleCredentialSchema = new Schema({
	access_token: {
		type: String
	}
	, refresh_token: {
		type: String
	}
	, client_id: {
		type: String
	}
})

var circleSchema = new Schema({
	name: {
		type: String
	}
	, circleId: {
		type: String
	}
})

var userSchema = new Schema({
	email: {
		type: String
		, index: {
			unique: true
			, sparse: true
		}
		, trim: true
		, required: true
	}
	, circles: [circleSchema]
	, profiles: {
		gPlusId: {
			type: String
			, index: {
				unique: true
				, sparse: true
			}
		}
		, salesforceId: {
			type: String
			, index: {
				unique: true
				, sparse: true
			}
		}
	}
	, publicDetails:{
		firstName: {
			type: String
		}
		, lastName: {
			type: String
		}
		, displayName: {
			type: String
		}
		, pictureURL: {
			type: String
		}
		, email: {
			type: String
		}
		, phone: {
			type: String
		}
		, location: {
			type: String
		}
		, role: {
			type: String
		}
	}
	, connections: {
		manager: {
			type: String
		}
		, hrManager: {
			type: String
		}
	}
	, keys: {
		gcmRegistrationIds: [{type: String}]
		, sessions: [googleCredentialSchema]
	}
})

var userModel = mongoose.model('user', userSchema)

var userModelInterface = {}
module.exports = userModelInterface

userModelInterface.createUserSession = function (err, params, callback) {

	var tokens = {}

	var addSession = function () {

		googleAPICalls.verifyIdToken(err, {authHeader: params.authHeader, id_token: tokens.id_token}, function (err, googleResponse) {

			if(err)
				return callback(err, false)

			var query
			if(googleResponse.email)
				query = {email: googleResponse.email}
			else if(googleResponse.sub)
				query = {'profiles.gPlusId': googleResponse.sub}

			userModel.findOne(query, function (err, userRecord) {

				if(err)
					return sendError(err, 3001, callback)
				else if(!userRecord && !tokens.refresh_token)
					return sendError(errors.refreshToken, 3005, callback)

				var currentSession = {}

				var updateBasicInfo = function () {

					async.parallel({

						googleResponse: function(callback) {
							googleAPICalls.retrieveBasicInfo(err, tokens, callback)
						},
						salesforceResponse: function(callback) {
							salesforceAPICalls.retrieveBasicInfo(err, {email: userRecord.email}, callback)
						}

					}, function (err, result) {

						if(err)
							return sendError(err, 3001)

						let googleResponse = result.googleResponse
						let salesforceResponse = result.salesforceResponse

						if(!googleResponse || !salesforceResponse)
							return sendError('googleResponse or salesforceResponse not valid', 3001)

						userRecord.publicDetails = {
							displayName: googleResponse.name? googleResponse.name: (salesforceResponse.firstName + ' ' + salesforceResponse.lastName)
							, firstName: googleResponse.given_name? googleResponse.given_name: salesforceResponse.firstName
							, lastName: googleResponse.family_name? googleResponse.family_name: salesforceResponse.lastName
							, pictureURL: googleResponse.picture
							, email: userRecord.email
							, location: salesforceResponse.location
							, role: salesforceResponse.role
						}
						userRecord.profiles.gPlusId = googleResponse.id
						userRecord.profiles.salesforceId = salesforceResponse.salesforceId

						if(!userRecord.connections.manager)
							userRecord.connections.manager = salesforceResponse.manager

						if(!userRecord.connections.hrManager)
							userRecord.connections.hrManager = salesforceResponse.hrManager

						userRecord.save(function (err) {

							if(err)
								return sendError(err, 3001)

							return

						})

					})
							
				}

				var getUserReady = function () {

					let paramsCreateAPITokens = {
						clientId: params.authHeader.clientId
						, access_token: currentSession.access_token
						, refresh_token: currentSession.refresh_token
						, email: userRecord.email
					}

					createAPITokens(err, paramsCreateAPITokens, function (err, teachPITokens) {

						if(err)
							return callback(err)

						userRecord.save(function (err) {

							if(err)
								return sendError(err, 3001, callback)

							let tokens = {}
							tokens[apiAccessTokenName] = teachPITokens.accessToken
							tokens[apiRefreshTokenName] = teachPITokens.refreshToken

							let jsonBuilder = {
								tokens: tokens
							}
							callback(err, jsonBuilder)

							updateBasicInfo()

						})
					})
				}
				
				if(userRecord) {

					if((userRecord.keys) && (userRecord.keys.sessions))
						currentSession = _.find(userRecord.keys.sessions, session => session.client_id === params.authHeader.clientId)

					if((!currentSession) && !(tokens.refresh_token))
						return sendError(errors.refreshToken, 3005, callback)

					if((currentSession) && (!tokens.refresh_token))

						googleAPICalls.refreshAccessToken(err, {authHeader: params.authHeader, refresh_token: currentSession.refresh_token}, function (err, refreshedTokens) {

							if(err)
								return callback(err)

							currentSession.access_token = refreshedTokens.access_token
							tokens = refreshedTokens
							getUserReady()

						})

					else if(tokens.refresh_token) {

						if(currentSession) {
							currentSession.access_token = tokens.access_token
							currentSession.refresh_token = tokens.refresh_token
							getUserReady()
						}

						else {

							currentSession = {
								access_token: tokens.access_token
								, refresh_token: tokens.refresh_token
								, client_id: googleResponse.aud
							}

							if(!userRecord.keys)
								userRecord.keys = {}
							if(!userRecord.keys.sessions)
								userRecord.keys.sessions = []

							userRecord.keys.sessions.push(currentSession)

							getUserReady()
						}

					}

				}

				else if(!userRecord && tokens.refresh_token) {

					if(googleResponse.hd !== hd)
						return sendError(sprintf(errors.hdMismatch, googleResponse), 3003, callback)

					currentSession = {
						access_token: tokens.access_token
						, refresh_token: tokens.refresh_token
						, client_id : params.authHeader.clientId
					}

					userRecord = new userModel({
						email: googleResponse.email
						, keys: { sessions: [currentSession] }
					})	

					getUserReady()				

				}

			})
		})
	}

	if(_.isString(params.body.authCode)) {

		googleAPICalls.verifyAuthCode(null, {authHeader: params.authHeader, authCode: params.body.authCode}, function (err, authTokens) {
			if(err)
				return callback(err)
			tokens = authTokens
			addSession()
		})

	}

	else if(_.isString(params.body.id_token)) {
		tokens.id_token = params.body.id_token
		addSession()
	}

}

userModelInterface.updateUser = function (err, params, callback) {

	var update

	if(_.isString(params.body.registration_token))
		update = {$push: {'keys.gcmRegistrationIds': params.body.registration_token}}
	else
		return sendError(errors.invalidInput, 3099, callback)

	verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		userModel.findOneAndUpdate({email: email}, update, function (err, userRecord) {

			if(err)
				return sendError(err, 3001, callback)
			if(userRecord)
				return callback(err)
			if(!userRecord)
				return sendError(sprintf(errors.userNotFound, email), 3011, callback)

		})

	})
}

userModelInterface.updateUserInternal = function (err, params, callback) {

	var update

	switch(params.query) {
	case('gcmRegistrationIds'):
		update = {$set: {'keys.gcmRegistrationIds': params.gcmRegistrationIds}}
		break
	}

	userModel.findOneAndUpdate({email: params.email}, update, function (err, userRecord) {

		if(err)
			return sendError(err, 3001, callback)
		if(userRecord)
			return callback(err)
		if(!userRecord)
			return sendError(sprintf(errors.userNotFound, params.email), 3011, callback)

	})
}

userModelInterface.retrieveUserDetails = function (err, params, callback) {

	var projection = []

	var projectionFunction = function (query) {
		switch(query) {
		case('gcmRegistrationIds'):
			return 'keys.gcmRegistrationIds'
		case('managerEmail'):
			return 'connections.manager'
		case('hrManagerEmail'):
			return 'connections.hrManager'
		case('publicDetails'):
			return 'publicDetails'
		case('salesforceId'):
			return 'profiles.salesforceId'
		}
	}

	if(_.isString(params.query))
		projection.push(projectionFunction(params.query))

	else if(_.isArray(params.query))
		_.forEach(params.query, function (query) {
			projection.push(projectionFunction(query))
		})

	else
		return callback(errors.invalidInput, 3099, callback)

	userModel.findOne({email: params.email}, projection.join(' '), {lean: true}, function (err, userRecord) {

		if(err)
			return callback(err)

		if(userRecord) {

			if(_.isString(params.query)) {

				let keys = projection.join('').split('.')

				if(keys.length === 2)
					return callback(err, userRecord[keys[0]][keys[1]])

				return callback(err, userRecord[projection])
			}

			else if(_.isArray(params.query)) {

				let json = {}

				_.forEach(projection, function (key, index) {

					json[params.query[index]] = userRecord[key]

					if(key.indexOf('.') >- 1) {
						let keys = key.split('.')
						if((keys.length === 2) && (userRecord[keys[0]]))
							json[params.query[index]] = userRecord[keys[0]][keys[1]]
					}

				})

				return callback(err, json)
			}
		}

		else if(!userRecord)
			return sendError(sprintf(errors.userNotFound, params.email), 3011, callback)

	})

}

var createAPITokens = userModelInterface.createAPITokens = function (err, params, callback) {

	var teachPITokens = {}

	var	plaintext = params.access_token + ':' + params.clientId,
		cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
	plaintext = _.padRight(plaintext, 220, 'o')

	teachPITokens.accessToken = cipher.update(plaintext, 'utf8', 'base64')
	teachPITokens.accessToken += cipher.final('base64')

	if(params.refresh_token) {

		plaintext = params.refresh_token + ':' + params.clientId + ':' + params.email + ':'
		cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
		plaintext = _.padRight(plaintext, 200, 'o')

		teachPITokens.refreshToken = cipher.update(plaintext, 'utf8', 'base64')
		teachPITokens.refreshToken += cipher.final('base64')

	}

	redisClient.hmset(teachPITokens.accessToken, {'clientId': params.clientId, 'email': params.email}, function (err, redisResponse) {

		if(err || redisResponse !== 'OK')
			return sendError(err, 3014, callback)

		redisClient.expire(teachPITokens.accessToken, accessTokenTTL, function (err, redisResponse) {

			if(err || redisResponse !== 1)
				sendError(sprintf(errors.redisError, err, redisResponse), 3014, callback)

			else if((teachPITokens.accessToken.length !== apiAccessTokenLength) || ((teachPITokens.refreshToken) && (teachPITokens.refreshToken.length !== apiRefreshTokenLength)))
				return sendError(sprintf(errors.tokenLength, params), 3008, callback)

			else 
				return callback(err, teachPITokens)

		})

	})

}

userModelInterface.refreshAccessToken = function (err, params, callback) {

	verifyUserToken(err, params.authHeader, function (err, email, refresh_token) {

		if(err)
			return callback(err)

		userModel.findOne({
			email: email
		}
		, 'keys'
		, {lean: true}
		, function (err, userRecord) {

			if(err)
				return sendError(err, 3001, callback)

			else if(userRecord) {

				var currentSession = _.find(userRecord.keys.sessions, (session) => session.client_id === params.authHeader.clientId)

				if(refresh_token !== currentSession.refresh_token)
					return sendError(errors.invalidInput, 3012, callback)

				googleAPICalls.refreshAccessToken(err, {authHeader: params.authHeader, refresh_token: currentSession.refresh_token}, function (err, tokens) {

					if(err)
						return callback(err)

					let paramsCreateAPITokens = {
						clientId: params.authHeader.clientId
						, access_token: tokens.access_token
						, email: email
					}

					createAPITokens(err, paramsCreateAPITokens, function (err, teachPITokens) {

						if(err)
							return callback(err)

						let jsonBuilder = {}
						jsonBuilder[apiAccessTokenName] = teachPITokens.accessToken
						return callback(err, jsonBuilder)

					})
				}) 
			}

			else if(!userRecord)
				return sendError(sprintf(errors.userNotFound, email), 3011, callback)

		})
	})
}

var verifyUserToken = userModelInterface.verifyUserToken = function (err, authHeader, callback) {

	var respond = function (decryptedToken) {

		if(decryptedToken[1] !== authHeader.clientId)
			return sendError(errors.invalidInput, 3007, callback)		
		else
			return callback(err, decryptedToken[2], decryptedToken[0])

	}

	if(authHeader.token) {

		if(authHeader.token.length === apiAccessTokenLength) {

			redisClient.exists(authHeader.token, function (err, redisResponse) {

				if(redisResponse) {
					redisClient.hmget(authHeader.token, 'token', 'clientId', 'email', function (err, redisResponse) {

						if(err)
							return sendError(err, 3014, callback)

						else if(redisResponse[2] === null)
							sendError(sprintf(errors.redisError, err, redisResponse), 3010, callback)

						else
							respond(redisResponse)	//redisResponse = [null, clientId, email]
					})
				}

				else if(err || !redisResponse)
					return sendError(errors.accessTokenExpired, 3010, callback)

			})					

		}

		else if(authHeader.token.length === apiRefreshTokenLength) {

			var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey)
				, decryptedToken = decipher.update(authHeader.token, 'base64', 'utf8')
			decryptedToken += decipher.final('utf8')
			decryptedToken = decryptedToken.split(':')	//decryptedToken = [gRefreshToken, clientId, email]

			respond(decryptedToken)
		}

		else
			return sendError(errors.invalidInput, 3009, callback)
	}

	else
		return sendError(errors.invalidInput, 3009, callback)

}

userModelInterface.createUser = function (err, params, callback) {

	var body = params.body

	var builder = function (user, callback) {

		let splitEmail = user.email.split('@')

		if((splitEmail.length !== 2) || (splitEmail[1] !== hd))
			return callback({err: sprintf(errors.hdMismatch, user.email), code: 3003})

		salesforceAPICalls.retrieveBasicInfo(err, {email: user.email}, function (err, salesforceResponse) {

			if(err)
				return callback({err: err, code: 8001})

			var query = {
				email: user.email
			}
			, update = {
				'connections.manager': user.managerEmail? user.managerEmail: salesforceResponse.manager
				, 'publicDetails.displayName': (salesforceResponse.firstName + ' ' + salesforceResponse.lastName)
				, 'publicDetails.firstName': salesforceResponse.firstName
				, 'publicDetails.lastName': salesforceResponse.lastName
				, 'connections.hrManager': salesforceResponse.hrManager
				, 'profiles.salesforceId': salesforceResponse.salesforceId
				, 'publicDetails.location': salesforceResponse.location
				, 'publicDetails.role': salesforceResponse.role
			}
			, options = {
				upsert: true
			}

			userModel.update(query, update, options, function (err) {
				if(err)
					return callback({err: err, code: 3001})
				callback()
			})

		})

	}

	if(_.isArray(body.users)) {
		async.each(body.users, builder, function (err) {

			if(err)
				return sendError(err.err, err.code, callback)

			return callback()

		})
	}

	else if(_.isObject(body)) {
		builder(body, function (err) {

			if(err)
				return sendError(err.err, err.code, callback)

			return callback()

		})
	}

	else
		return sendError(err, 3099, callback)

}

userModelInterface.retrieveAllUsers = (err, callback) => {

	userModel.find({}, callback)
}
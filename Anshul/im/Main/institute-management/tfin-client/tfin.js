'use strict'

const http = require('http')
const _ = require('lodash')

const constants = require('./configs/constants.json')
const hostConstant = constants.host
	, portConstant = constants.port

const callTfin = function (options, body, callback) {

	if(!callback) {
		callback = body
		body = ''
	}

	var request = http.request(options, function (response) {

		response.setEncoding('utf-8')

		if(response.statusCode === 200) {

			var responseObject = ''

			response.on('data', function (chunk) {
				responseObject += chunk
			})

			response.on('end', function () {

				responseObject = JSON.parse(responseObject)

				if(responseObject.errors === 'yes') {

					if(responseObject.errorCode === 3010)
						options.refreshTokenHandler()

					return callback(responseObject)

				}

				else if(responseObject.errors === 'no')
					return callback(null, responseObject)

			})
		}

		else
			return callback(response.statusCode)
	})

	request.on('error', function (err) {
		return callback(err)
	})

	request.write(body)
	request.end()

}

var TfinClient = function (config) {

	var majorVersion = this.majorVersion = config.majorVersion? config.majorVersion: 0

	this.defaultOptions = {
		host: config.host? config.host: hostConstant,
		port: config.port? config.port: portConstant,
		basePath: '/api/v' + majorVersion,
		method: 'GET',
		refreshTokenHandler: config.refreshTokenHandler? config.refreshTokenHandler: function () {},
		headers: {
			Authorization: 'Basic ' + new Buffer(config.apiKey + ':' + config.clientId).toString('base64')
		}
	}

	this.index = (function (self) {

		var index = {

			candidate: function (params, callback) {

				if(!callback)
					callback = params

				var body = JSON.stringify(params.body)

				let options = {}

				var localOptions = {
					method: 'POST'
					, path: self.defaultOptions.basePath + '/index/candidate/' + params.candidateId
					, headers: {
						'Content-Type': 'application/json'
						, 'Content-Length': Buffer.byteLength(body)
					}
				}
				_.merge(options, self.defaultOptions, localOptions)

				callTfin(options, body, callback)
			}

		}

		return index

	})(this)

	this.key = (function (self) {

		var key = {

			scopes: function (params, callback) {

				if(!callback)
					callback = params

				let options = {}

				let localOptions = {
					path: self.defaultOptions.basePath + '/key/scopes'
				}
				_.merge(options, self.defaultOptions, localOptions)

				callTfin(options, callback)

			}
		}

		return key

	})(this)

	this.user = (function (self) {

		var user = {

			sessions: function (params, callback) {

				let body = JSON.stringify({
					authCode: params.authCode
				})

				let options = {}

				let localOptions = {
					method: 'POST',
					path: self.defaultOptions.basePath + '/user/sessions',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(body)
					}
				}
				_.merge(options, self.defaultOptions, localOptions)

				callTfin(options, body, callback)

			},

			tokens: (params, callback) => {

				let options = {}

				let localOptions = {
					path: self.defaultOptions.basePath + '/user/tokens',
					headers: {
						Authorization: 'Basic ' + new Buffer(`${config.apiKey}:${config.clientId}:${params.refreshToken}`).toString('base64')
					}
				}

				_.merge(options, self.defaultOptions, localOptions)

				callTfin(options, callback)

			}
		}

		return user

	})(this)

	this.search = function (params, callback) {

		let query = JSON.stringify(params.q)

		let options = {}

		let localOptions = {
			path: `${this.defaultOptions.basePath}/search?q=${query}&context=people`,
			headers: {
				Authorization: 'Basic ' + new Buffer(config.apiKey + ':' + config.clientId + ':' + params.accessToken).toString('base64')
			}
		}
		_.merge(options, this.defaultOptions, localOptions)

		callTfin(options, callback)

	}.bind(this)

}

module.exports = TfinClient
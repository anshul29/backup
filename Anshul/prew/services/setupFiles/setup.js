'use strict'

var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')
var prompt = require('prompt')
var jsonfile = require('jsonfile')
var sprintf = require('sprintf')
var _ = require('lodash')
var chalk = require('chalk')

var source = path.join(__dirname, 'variablesSample/variables.json')
, target = path.join(__dirname, '../configs/variables/variables.json')

var mongoose = require('mongoose')

jsonfile.spaces = 4

var configSchema = {
	properties: {
		environment: {
			description: 'Enter the environment you wish to configure: '
			, type: 'string'
			, default: 'development'
			, conform: function (v) {
				return ((v === 'development') || (v === 'staging') || (v === 'production'))
			}
			, message: 'Must be development, staging or production'
		}
		, protocol: {
			description: 'Enter protocol to connect to database: '
			, type: 'string'
			, default: 'mongodb'
		}
		, host: {
			description: 'Enter host to connect to database: '
			, type: 'string'
			, default: 'localhost'
		}
		, port: {
			description: 'Enter port to connect to database: '
			, type: 'number'
			, default: 27017
		}
		, database: {
			description: 'Enter database to connect to. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, username: {
			description: 'Enter username to connect to database. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, password: {
			description: 'Enter password to connect to database. Leave blank to keep unchanged: '
			, type: 'string'
			, hidden: true
		}
		, salesforceLoginUrl: {
			description: 'Enter salesforce URL: '
			, type: 'string'
			, default: 'https://login.salesforce.com'
		}
		, salesforceUsername: {
			description: 'Enter your salesforce username. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, salesforcePassword: {
			description: 'Enter your salesforce password. Leave blank to keep unchanged: '
			, type: 'string'
			, hidden: true
		}
		, tfinPort: {
			description: 'Enter port on which application will run: '
			, type: 'number'
			, default: 3000
			, conform: function (v) {
				return (v >= 1024)
			}
			, message: 'Cannot use privileged ports: '
		}
		, encryptionKey: {
			description: 'Enter key to encrypt user sessions. Leave blank to keep unchanged: '
			, type: 'string'
			, hidden: true
			, conform: function (v) {
				return ((v.length === 0 ) || (v.length === 31))
			}
			, message: 'should be 31 characters'
		}
		, orgCalendarId: {
			description: 'Enter calendarId of org-Calendar. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, refreshToken: {
			description: 'Enter refresh_token for technology id. Leave blank to keep unchanged: '
			, type: 'string'
			, hidden: true
		}
		, apiKey: {
			description: 'Enter apiKey. Leave blank to keep unchanged: '
			, type: 'string'
			, hidden: true
		}
		, clientId: {
			description: 'Enter clientId. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, elasticSalt: {
			description: 'Enter salt for es document ids. Leave blank to keep unchanged: '
			, type: 'string'
		}
		, corsOriginWhitelist: {
			description: 'Enter domains to whitelist, separated by commas'
			, type: 'string'
			, default: 'http://localhost:8080'
		}
		, continueSetup: {
			description: 'Continue setup to configure more environments - y or n?'
			, type: 'string'
			, default: 'n'
		}
	}
}

prompt.message = ''
prompt.delimiter = ''
prompt.colors = false

prompt.start({})

var responses = {}
	, done = 0
	, skip = 0

var changeConfigFile = function (callback) {

	fs.access(target, function (err) {

		var data

		var calculate = function () {

			for(var key in responses) {

				if(!responses.hasOwnProperty(key))
					continue

				let result = responses[key]

				let config = {}
				config.db = {}

				if(data[result.environment])
					config = data[result.environment]

				let db = {
					protocol: result.protocol
					, host: result.host
					, port: result.port
					, database: result.database? result.database: config.db.database
					, username: result.username? result.username: config.db.username
					, password: result.password? result.password: config.db.password
				}
				config.db = db

				let salesforce = {
					loginUrl: result.salesforceLoginUrl
					, username: result.salesforceUsername? result.salesforceUsername: config.salesforce.username
					, password: result.salesforcePassword? result.salesforcePassword: config.salesforce.password
				}
				config.salesforce = salesforce

				let google = {
					refresh_token: result.refreshToken? result.refreshToken: config.google.refresh_token
					, orgCalendarId: result.orgCalendarId? result.orgCalendarId: config.google.orgCalendarId
				}
				config.google = google

				let authHeader = {
					apiKey: result.apiKey? result.apiKey: config.authHeader.apiKey
					, clientId: result.clientId? result.clientId: config.authHeader.clientId
				}
				config.authHeader = authHeader

				let elasticSearch = {
					salt: result.elasticSalt? result.elasticSalt: config.elasticSearch.salt
				}
				config.elasticSearch = elasticSearch

				let cors = {
					originWhitelist: result.originWhitelist? result.originWhitelist: config.cors.originWhitelist
				}
				config.cors = cors

				config.tfinPort = result.tfinPort
				config.encryptionKey = result.encryptionKey? result.encryptionKey: config.encryptionKey

				data[result.environment] = config

			}

			console.log(chalk.blue('\nUpdating configuration . . .'))

			mkdirp(path.dirname(target), function (err) {

				if(err)
					callback(err)

				else {

					jsonfile.writeFile(target, data, function (err) {

						if(err) {
							console.log(chalk.red(err))
							callback(err)
						}

						else {

							let error = err

							var check = function (dbDetails) {

								dbDetails.URI = sprintf('%s://%s:%s@%s:%s/%s', dbDetails.protocol, dbDetails.username, dbDetails.password, dbDetails.host, dbDetails.port, dbDetails.database)

								let db = mongoose.createConnection(dbDetails.URI)

								db.on('error', function (err) {

									error = err

									console.log(chalk.red(err))
									console.log(chalk.red('\nCould not connect to %s with those details. Error: %s\n'), dbDetails.database, JSON.stringify(err))
									db.close()

									if((++done + skip) === 3)
										return callback(err)

								})

								db.once('open', function () {

									console.log(chalk.green('\nConnected to %s successfully\n'), dbDetails.database)
									db.close()

									if((++done + skip) === 3)
										return callback(error)

								})

							}

							console.log(chalk.green('\nConfiguration Updated\n') + chalk.blue('\nTrying to connect to database using config . . .\n'))

							_.forEach(data, function (value, key) {

								if((value.db.database) && (value.db.database.length > 0)) {
									console.log(chalk.blue('Checking ' + key))
									check(value.db)
								}

								else {
									console.log(chalk.blue('Skipping ' + key))
									skip++
									if (skip === 3)
										callback('No database configured')
								}

							})

						}

					})
				}

			})


		}

		if(err) {
			jsonfile.readFile(source, function (err, sample) {
				data = sample
				calculate()
			})
		}

		else {
			jsonfile.readFile(target, function (err, sample) {
				data = sample
				calculate()
			})
		}

	})	

}

var getInput = function () {

	console.log(chalk.blue('\nStarting TfIN Setup . . . \n\nThis will configure your environmentVariables file\n'))

	prompt.get(configSchema, function (err, result) {

		if(err) {
			console.log(chalk.red(err))
			console.log(chalk.red('Exiting'))
			process.exit()
		}

		else if(result) {

			responses[result.environment] = result	

			if(result.continueSetup === 'y')
				getInput()

			else{
				changeConfigFile(function (err) {
					if(!err) {
						console.log(chalk.green('Setup Complete'))
						process.exit()
					}
					if (err) {
						console.log(chalk.red(err))
						console.log(chalk.red('\nThere was an error with the config. Try again'))
						process.exit()
					}
				})
			}
		}

	})

}

getInput()
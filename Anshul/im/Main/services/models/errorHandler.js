'use strict'

const redisTTL = 1*24*60*60
	, redisDB = require('../configs/constants.json').redisDB.errorHandler

const log = require('../server').log

const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const _ = require('lodash')

const redis = require('redis')
var redisClient = redis.createClient()
redisClient.on('error', err => {
	sendError(err, 3014)
})

redisClient.select(redisDB, (err, redisResponse) => {
	if(err || redisResponse !== 'OK')
		sendError(err, 5014)
})

var errorCodeSchema = new Schema({
	logLevel: String,
	code: {
		type: Number,
		index: {
			unique: true,
			sparse: true
		},
		trim: true,
		required: true
	},
	userMessage: String,
	detail: String	
})

var errorModel = mongoose.model('errorCodes', errorCodeSchema)

const errorHandler = {}
module.exports = errorHandler

errorHandler.insertRecords = (err, json, callback) => {

	let success

	_.forEach(json, value => {
		var errorRecord = new errorModel(value)
		errorRecord.save((err, errorRecord) => {
			if(err)
				log.error(err)
			else {
				log.info('inserted record for ' + errorRecord.code)
				success++
			}
		})
	})

	return callback(err, success)
}

errorHandler.info = (message, code) => {
	log.info({code: code}, message)
}

var sendError = errorHandler.sendError = (err, code, callback)  => {

	var errorRecord = {}
	var error = new Error(err)
	error.code = code

	var respond = () => {
		error.userMessage = errorRecord.userMessage
		switch(errorRecord.logLevel) {
		case('trace'):
			log.trace(error)
			break
		case('debug'):
			log.debug(error)
			break
		case('info'):
			log.info(error)
			break
		case('warn'):
			log.warn(error)
			break
		case('error'):
			log.error(error)
			break
		case('fatal'):
			log.fatal(error)
			break
		}
		if(callback)
			return callback(error)
		else
			return
	}

	redisClient.hgetall(code, (err, redisResponse) => {

		if((!err) && redisResponse !== null) {
			errorRecord = redisResponse
			respond()
		}
		else {
			errorModel.findOne({
				code: code
			},
			'userMessage logLevel',
			{lean: true},
			(dbErr, errorRec) => {
				if(dbErr) {
					log.error(dbErr)
					log.error(err)
				}
				else if(errorRec) {
					errorRecord = errorRec
					redisClient.hmset(code, errorRec, err => {
						if(!err) redisClient.expire(code, redisTTL)
					})
					respond()
				}
				else if(!errorRec) {
					log.error(error)
					log.error('no error code for ' + code)
					respond()
				}
			})
		}

	})
}
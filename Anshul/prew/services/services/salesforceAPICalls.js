'use strict'

const salesforceConfig = require('../configs/config').salesforce
	, clientId = salesforceConfig.clientId
	, clientSecret = salesforceConfig.clientSecret
	, redirectUri = salesforceConfig.redirectUri
	, refreshToken = salesforceConfig.refreshToken
	, accessToken = salesforceConfig.accessToken
	, instanceUrl = salesforceConfig.instanceUrl
	, constants = require('../configs/constants.json').salesforce
	, accountObject = constants.accountObject
	, contactObject = constants.contactObject
	, contactObjectCustom = constants.contactObjectCustom
	, experienceObject = constants.experienceObject
	, leaveObject = constants.leaveObject
	, leaveCount = constants.leaveCount
	, leaveAvailable = constants.leaveAvailable
	, leaveMax = constants.leaveMax
	, fellowRecordTypeId = constants.fellowRecordTypeId
	, staffRecordTypeId = constants.staffRecordTypeId
	, corporationRecordTypeId = constants.corporationRecordTypeId
	, universityRecordTypeId = constants.universityRecordTypeId
	, roles = {}
	, errors = {
		userNotFoundOnSalesforce: 'user %s not found on salesforce'
	}

const experienceMap = require('./salesforceFieldMaps/experienceMap.json')
const profileMap = require('./salesforceFieldMaps/profileMap.json')

roles[fellowRecordTypeId] = 'fellow'
roles[staffRecordTypeId] = 'staff'

const sendError = require('../models/errorHandler').sendError
const debug = require('../models/errorHandler').debug

const sprintf = require('sprintf')
	, async = require('async')
	, _ = require('lodash')

const jsforce = require('jsforce')

const oauth2 = new jsforce.OAuth2({
	clientId: clientId,
	clientSecret: clientSecret,
	redirectUri: redirectUri
})

const conn = new jsforce.Connection({
	oauth2: oauth2,
	instanceUrl: instanceUrl,
	accessToken: accessToken,
	refreshToken: refreshToken
})

// let generateAndAuthorize = () => {

// 	let url  = oauth2.getAuthorizationUrl({scope: 'api refresh_token offline_access'})

// 	conn.authorize(decodeURIComponent(''), (err, info) => {
// 		let usefulInfo = {
// 			info: info,
// 			accessToken: conn.accessToken,
// 			refreshToken: conn.refreshToken,
// 			instanceUrl: conn.instanceUrl
// 		}
// 	})

// }

const salesforceAPICalls = {}
module.exports = salesforceAPICalls

salesforceAPICalls.retrieveBasicInfo = function (err, params, callback) {

	let email = params.email

	let selectionFields = {}

	conn.sobject(contactObject)
	.find({
		$and: [
			{$or: [{email: email}, {npe01__WorkEmail__c: email}]},
			{$or: [{RecordTypeId: staffRecordTypeId}, {RecordTypeId: fellowRecordTypeId}]}
		]
	},{
		Id: 1,
		RecordTypeId: 1,
		HR_Manager__c: 1,
		Manager__c: 1,
		Location__c: 1,
		Placement_City__c: 1,
		firstName: 1,
		lastName: 1
	})
	.limit(1)
	.execute(function (err, result) {

		if(err)
			return sendError(err, 8001, callback)

		var manager = {}

		var builder = function () {

			let jsonObject = {
				salesforceId: result[0].Id,
				firstName: result[0].FirstName,
				lastName: result[0].LastName,
				role: roles[result[0].RecordTypeId],
				manager: manager.Email,
				hrManager: result[0].HR_Manager__c,
				location: result[0].Location__c? result[0].Location__c: result[0].Placement_City__c
			}

			return callback(err, jsonObject)

		}

		if(result[0] && result[0].Manager__c)

			conn.sobject(contactObject).retrieve(result[0].Manager__c, function (err, result) {

				if(err)
					return sendError(err, 8001, callback)

				manager = result
				builder()

			})

		else if(result[0])
			builder()

		else
			sendError(sprintf(errors.userNotFoundOnSalesforce, email), 8002, callback)

	})

}

salesforceAPICalls.buildProfile = (err, params, callback) => {

	let salesforceId = params.salesforceId

	async.parallel({

		experiences: (cb) => {

			let selectionFields = _.keys(experienceMap).join()

			debug(selectionFields)

			let query = `SELECT ${selectionFields} FROM ${experienceObject} WHERE ${contactObjectCustom} = '${salesforceId}'`

			conn.query(query, (err, result) => {

				debug({err: err, result: result})

				if(Boolean(result.done) === false)
					sendError(7002, errors.doneNotTrue)

				let experiences = _.map(result.records, record => {
					let rec = mapper(record, experienceMap)
					if (record.Organization__c !== null)
						rec.type = 'worked'
					else if (record.Organization_if_other__c !== null)
						rec.type = 'worked'
					else if (record.College__c !== null)
						rec.type = 'studied'
					else if (record.College_if_other__c !== null)
						rec.type = 'studied'
					else
						sendError('no record type', 7003)
					return rec
				})

				cb(err, experiences)
			})
		},

		main: (cb) => {

			let selectionFields = `Title,
				Vertical__c,
				Current_Company_Designation__c,
				Designation__c`

			let query = `SELECT ${selectionFields} FROM ${contactObject} WHERE Id = '${salesforceId}'`

			conn.query(query, (err, result) => {

				if(Boolean(result.done) === false)
					sendError(7002, errors.doneNotTrue)

				let map = {
					'Title': 'title',
					'Vertical__c': 'primaryCircle',
					'Designation__c': 'designation',
					'Current_Company_Designation__c':'designation'
				}

				let main = mapper(result.records[0], map)

				cb(err, main)
			})

		}
	}, (err, results) => {

		if(err)
			return sendError(err, 7001, callback)

		callback(err, results)

	})
	
}

salesforceAPICalls.getOrganizations = (err, params, callback) => {

	let selectionFields = 'Id, Name, RecordTypeId'

	async.parallel({
		corporations: (cb) => {

			conn.query(`SELECT ${selectionFields} FROM ${accountObject} WHERE RecordTypeId = '${corporationRecordTypeId}'`, (err, result) => {

				if(Boolean(result.done) === false)
					sendError(7002, errors.doneNotTrue)
				
				let corporations = _.map(result.records, record => ({
					salesforceId: record.Id,
					name: record.Name
				}))

				cb(err, corporations)

			})

		},
		universities: (cb) => {

			conn.query(`SELECT ${selectionFields} FROM ${accountObject} WHERE RecordTypeId = '${universityRecordTypeId}'`, (err, result) => {

				if(Boolean(result.done) === false)
					sendError(7002, errors.doneNotTrue)

				let universities = _.map(result.records, record => ({
					salesforceId: record.Id,
					name: record.Name
				}))

				cb(err, universities)

			})
		}
	}, (err, results) => {

		if(err)
			return sendError(err, 7001, callback)

		callback(err, results)

	})

}

salesforceAPICalls.retrieveLeaveCounters = function (err, params, callback) {

	let salesforceId = params.salesforceId

	conn.sobject(contactObject).retrieve(salesforceId, function (err, result) {

		if(err)
			return sendError(err, 8001, callback)

		let jsonObject = {
			leaveMax: result[leaveMax],
			leaveCount: result[leaveCount],
			leaveAvailable: result[leaveAvailable]
		}

		return callback(err, jsonObject)
	})

}

salesforceAPICalls.createLeave = function (err, leaveDetails, callback) {

	conn.sobject(leaveObject).create(leaveDetails, function (err, result) {

		if(err)
			return sendError(err, 8001, callback)

		return callback(err, result.id)

	})

}

salesforceAPICalls.updateLeave = function (err, leaveDetails, callback) {

	conn.sobject(leaveObject).update(leaveDetails, function (err, result) {

		if(err)
			return sendError(err, 8001, callback)

		return callback(err, result.id)

	})

}

let mapper = (src, map) => {

	let dest = {}

	_.forEach(map, (value, key) => {
		if(src[key] !== null)
			dest[value] = src[key]
	})

	return dest

}
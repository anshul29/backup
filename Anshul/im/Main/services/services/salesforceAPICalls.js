'use strict'

const salesforceConfig = require('../configs/config').salesforce
	, loginUrl = salesforceConfig.loginUrl
	, username = salesforceConfig.username
	, password = salesforceConfig.password
	, constants = require('../configs/constants.json').salesforce
	, contactObject = constants.contactObject
	, leaveObject = constants.leaveObject
	, leaveCount = constants.leaveCount
	, leaveAvailable = constants.leaveAvailable
	, leaveMax = constants.leaveMax
	, fellowRecordTypeId = constants.fellowRecordTypeId
	, staffRecordTypeId = constants.staffRecordTypeId
	, roles = {}
	, errors = {
		userNotFoundOnSalesforce: 'user %s not found on salesforce'
	}

roles[fellowRecordTypeId] = 'fellow'
roles[staffRecordTypeId] = 'staff'

var sendError = require('../models/errorHandler').sendError

var sprintf = require('sprintf')

var jsforce = require('jsforce')

var conn = new jsforce.Connection({
	loginUrl: loginUrl
})

var salesforceAPICalls = {}
module.exports = salesforceAPICalls

salesforceAPICalls.retrieveBasicInfo = function (err, params, callback) {

	let email = params.email

	conn.login(username, password, function (err) {

		if(err)
			return sendError(err, 8001, callback)

		conn.sobject(contactObject)
		.find({
			$and: [
				{$or: [{email: email}, {npe01__WorkEmail__c: email}]}
				, {$or: [{RecordTypeId: staffRecordTypeId}, {RecordTypeId: fellowRecordTypeId}]}
			]
		},
		{
			Id: 1
			, RecordTypeId: 1
			, HR_Manager__c: 1
			, Manager__c: 1
			, Location__c: 1
			, Placement_City__c: 1
			, firstName: 1
			, lastName: 1
		})
		.limit(1)
		.execute(function (err, result) {

			if(err)
				return sendError(err, 8001, callback)

			var manager = {}

			var builder = function () {

				let jsonObject = {
					salesforceId: result[0].Id
					, firstName: result[0].FirstName
					, lastName: result[0].LastName
					, role: roles[result[0].RecordTypeId]
					, manager: manager.Email
					, hrManager: result[0].HR_Manager__c
					, location: result[0].Location__c? result[0].Location__c: result[0].Placement_City__c
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

	})
}

salesforceAPICalls.retrieveLeaveCounters = function (err, params, callback) {

	let salesforceId = params.salesforceId

	conn.login(username, password, function (err) {

		if(err)
			return sendError(err, 8001, callback)

		conn.sobject(contactObject).retrieve(salesforceId, function (err, result) {

			if(err)
				return sendError(err, 8001, callback)

			let jsonObject = {
				leaveMax: result[leaveMax]
				, leaveCount: result[leaveCount]
				, leaveAvailable: result[leaveAvailable]
			}

			return callback(err, jsonObject)
		})

	})

}

salesforceAPICalls.createLeave = function (err, leaveDetails, callback) {

	conn.login(username, password, function (err) {

		if(err)
			return sendError(err, 8001, callback)

		conn.sobject(leaveObject).create(leaveDetails, function (err, result) {

			if(err)
				return sendError(err, 8001, callback)

			return callback(err, result.id)

		})

	})

}

salesforceAPICalls.updateLeave = function (err, leaveDetails, callback) {

	conn.login(username, password, function (err) {

		if(err)
			return sendError(err, 8001, callback)

		conn.sobject(leaveObject).update(leaveDetails, function (err, result) {

			if(err)
				return sendError(err, 8001, callback)

			return callback(err, result.id)

		})

	})

}
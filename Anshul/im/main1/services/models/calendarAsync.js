'use strict'

const errors = {
	kueError: 'error with kue: %s'
	, calendarNotFound: 'calendar not found'
	, salesforceIdNotFound: 'salesforceId Not Found'
	, invalidEventId: 'invalid eventId'
}

var _ = require('lodash')
var moment = require('moment-timezone')
var sprintf = require('sprintf')

var sendError = require('./errorHandler').sendError

var notificationModel = require('./notificationModel')

var salesforceAPICalls = require('../services/salesforceAPICalls')

var kue = require('kue')
var queue = kue.createQueue({
	redis : {
		db: require('../configs/constants.json').redisDB.kue
	}
})
queue.on('error', function (err) {
    sendError(sprintf(errors.kueError, err), 3015)
})

queue.on('job complete', function (id) {

	kue.Job.get(id, function (err, job) {

		if(err)
			return sendError(sprintf(errors.kueError, err), 3016)

		job.remove(function (err) {
			if(err)
				return sendError(sprintf(errors.kueError, err), 3016)
		})
	})
})

var calendarAsync = module.exports = {}

calendarAsync.notification = function (notificationObject, callback) {

	notificationModel.leaveNotification(null, notificationObject, function (err) {

		if(callback)
			callback(err)

    })

}

calendarAsync.salesforce = function (params, callback) {

	salesforce(params, function (err) {

		if(err)

			queue
			.create('salesforce', {
				title: params.verb
	            , params: params
	            , callback: callback
	        })
	        .attempts(3).backoff({
	        	delay: 60*1000
	        	, type: 'exponential'
	        })
	        .save(function (err) {

	        	if(err)
	        		return sendError(err, 3016, callback)
	        	return callback? callback(): ''
	        })

	})

}

var salesforce = function (params, callback) {

	var calendar = params.calendar
		, id = params.eventId
		, verb = params.verb

	var currentEvent = _.findLast(calendar.events, function (value) {
		return value._id.toString() === id.toString()
	})

	if(verb === 'create') {

		if(!calendar)
			return sendError(errors.calendarNotFound, 4012, callback)

		if(!calendar.salesforceId)
			return sendError(errors.salesforceIdNotFound, 4013, callback)

		let leaveObject = {
			Employee_name__c: calendar.salesforceId
			, Applied_for__c: true
			, RecordTypeId: '01290000000qiEE'
			, From_Date__c: currentEvent.start.date
			, To_Date__c: moment(currentEvent.end.date).subtract(1, 'd').toDate()
		}	

		salesforceAPICalls.createLeave(null, leaveObject, function (err, salesforceId) {

	    	if(!err) {    		

		    	currentEvent.salesforceId = salesforceId
		    	calendar.save(function (err) {
		    		if(err)
		    			return sendError(err, 4001, callback)
		    		
		    		return callback()
		    	})

		    }

		    else 
			    return callback(err)

	    })

	}

	else if(verb === 'update') {

		if(!currentEvent)
			return sendError(errors.invalidEventId, 4012, callback)

		if(!currentEvent.salesforceId)
			return sendError(errors.salesforceIdNotFound, 4013, callback)

		let leaveObject = {
	    	Id: currentEvent.salesforceId
			, From_Date__c: currentEvent.start.date
			, To_Date__c: moment(currentEvent.end.date).subtract(1, 'd').toDate()
			, Manager_approved__c: (currentEvent.leaveDetails.status.toLowerCase() === 'approved')
			, Manager_rejected__c: (currentEvent.leaveDetails.status.toLowerCase() === 'rejected')
			, Applied_for_cancellation__c: (currentEvent.leaveDetails.status.toLowerCase() === 'cancelled')
		}

		salesforceAPICalls.updateLeave(null, leaveObject, function (err) {
			return callback(err)
		})

	}

}

queue.process('salesforce', function (self, callback) {

	var params = self.data.params
		, calendar = params.calendar

	require('./calendarModel').retrieveCalendar(null, {
		calendarId: calendar.calendarId
	}, function (err, cal) {

		params.calendar = cal
		salesforce(params, function (err) {
			callback(err)
		})
	})

})
'use strict'

const bot = {
		email: 'path.bot@teachforindia.org'
		, firstName: 'Path'
		, lastName: 'Bot'
		, displayName: 'Path Bot'
	}
	, errors = {
		redisError: 'err: %s, redisResponse: %s'
		, invalidDates: 'invalid date'
		, calendarNotFound:'calendar not found for %s'
		, leaveCounterMissing: 'leaveCounter missing for %s'
		, accessRights: 'no accessRights for %s on %s to do %s'
		, invalidEventId: 'invalid eventId'
		, invalidInputs: 'invalid inputs'
		, managerNotFound: 'no manager for %s'
		, hrManagerNotFound: 'no hr manager for %s'
		, notificationErr: 'could not send notification for %s on %s. Err: %s'
	}
	, botComments = {
		leaveUpdate: '%s has updated the leave'
		, leaveCreate: '%s has applied for leave'
		, leaveApprove: '%s has approved the leave :)'
		, leaveReject: '%s has rejected the leave'
		, leaveCancel: '%s has cancelled the leave'
	}
	, notificationText = {
		leaveUpdate: 'Leave Updated: %s'
		, leaveCreate: 'Leave Request: %s'
		, leaveCancel: 'Leave Cancelled',
		leaveApprove: 'Your request for leave has been approved :)'
		, leaveReject: 'Your request for leave has been rejected :('
	}
	, daysOfWeek = {
		Sunday: 0
	}
	, holidayTTL = 180*24*60*60
	, redisDB = require('../configs/constants.json').redisDB.calendarModel

const mongoose = require('mongoose')
	, Schema = mongoose.Schema

var _ = require('lodash')
var crypto = require('crypto')
var moment = require('moment-timezone')
var sprintf = require('sprintf')
var async = require('async')

var sendError = require('./errorHandler').sendError

var googleAPICalls = require('../services/googleAPICalls')
var salesforceAPICalls = require('../services/salesforceAPICalls')

var notificationModel = require('./notificationModel')
var userModel = require('./userModel')

var calendarAsync = require('./calendarAsync')

var redis = require('redis')
var redisClient = redis.createClient()
redisClient.on('error', function (err) {
	sendError(err, 3014)
})

redisClient.select(redisDB, function (err, redisResponse) {

	if(err || redisResponse !== 'OK')
		sendError(err, 5014)

	holidayBuilder()

})

var conversationSchema = new Schema({
	comment: {
		type: String
	}
	, time: {
		type: Date
	}
	, author: {
		email: {
			type: String
		}
		, firstName: {
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
	}
})

var attendeesSchema = new Schema({
	email: {
		type: String
	}
	, publicDetails: {
		email: {
			type: String
		}
		, firstName: {
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
		, location: {
			type: String
		}
		, role: {
			type: String
		}
	}
	, self: {
		type: Boolean
	}
	, actions: []
})

var eventSchema = new Schema({
	start: {
		date: {
			type: Date
		}
	}
	, end: {
		date: {
			type: Date
		}
	}
	, recurringEventId: {
		type: Schema.Types.ObjectId
	}
	, attendees: [attendeesSchema]
	, eventType: {
		type: String
	}
	, salesforceId: {
		type: String
	}
	, leaveDetails: {
		status: {
			type: String
		},
		reason: {
			type: String
		},
		countDays: {
			type: String
		}
	}
	, extendedProperties: {
		private: {
			type: String
		},
		shared: {
			type: Schema.Types.Mixed
		}
	}
	, conversation: [conversationSchema]
})

var calendarSchema = new Schema({
	calendarId: {
		type: String
		, index: {
			unique: true,
			sparse: true
		}
		, trim: true
		, required: true
	}
	, salesforceId: {
		type: String
	}
	, accessRights: [{
		email: {
			type: String
			, required: true
		}
		, read: {
			type: Boolean
		}
		, write: {
			type: Boolean
		}
	}]
	, events: [eventSchema]
	, counters: {
		leaveCounter: {
			leaveCount: {
				type: Number
				, default: 0
			}
			, leaveMax: {
				type: Number
				, default: 0
			}
			, leaveAvailable: {
				type: Number
			}
		}
	}
})

calendarSchema.pre('save', function (next) {

	let leaveCounter = this.counters.leaveCounter

	leaveCounter.leaveAvailable = leaveCounter.leaveMax - leaveCounter.leaveCount
	if(leaveCounter.leaveAvailable < 0)
		leaveCounter.leaveAvailable = 0

	next()

})

var calendarModel = mongoose.model('calendar', calendarSchema)

var calendarModelInterface = {}
module.exports = calendarModelInterface

calendarModelInterface.retrieveCounters = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		calendarModel.findOne({
			calendarId: email
		}
		, 'counters.leaveCounter'
		, {lean: true}
		, function (err, calendar) {

			if(err)
				return sendError(err, 4001, callback)

			var respond = function () {
				let jsonBuilder = {
					leaveCounter: calendar.counters.leaveCounter
				}
				return callback(err, jsonBuilder)
			}

			if(calendar)
				respond()
			else if(!calendar)
				createCalendar(email, function (err, newCalendar) {
					if(err)
						return callback(err)
					calendar = newCalendar
					respond()
				})

		})
	})
}

calendarModelInterface.retrieveEvents = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		var calendarId = email
		if(_.isString(params.query.calendarId))
			calendarId = params.query.calendarId

		calendarModel.findOne({
			calendarId: calendarId
		}
		, 'events accessRights'
		, {lean: true}
		, function (err, calendar) {

			if(err)
				return sendError(err, 4001, callback)

			var router = function () {

				if(_.isString(params.query.eventId))
					eventRetriever()
				else if(_.isString(params.query.eventType))
					eventsRetriever()
				else
					return sendError(errors.invalidInputs, 4099, callback)

			}

			var accessRightsValidator = function () {

				var eventReader = _.findIndex(calendar.accessRights, function (value) {
					return ((value.email === email) && (value.read === true))
				})

				if(eventReader === -1) {

					userModel.retrieveUserDetails(err, {email: calendarId, query: 'managerEmail'}, function (err, managerEmail) {

						if(managerEmail === email) {

							calendar.accessRights.push({
								email: email
								, read: true
								, write: true
							})
							calendarModel.update({calendarId: calendarId}, {accessRights: calendar.accessRights}, function (err) {
								if(err)
									sendError(err, 4001)
							})

							router()

						}

						else
							return sendError(sprintf(errors.accessRights, email, calendarId, 'read'), 4099, callback)

					})
					
				}

				else
					router()
	
			}

			var eventsRetriever = function () {

				var query = {
					eventType: params.query.eventType
					, minDate: params.query.minDate ? moment.tz(params.query.minDate, 'DD/MM/YYYY', 'GMT').add(1, 'd'): moment().tz('GMT').subtract(1, 'year')
					, maxDate: params.query.maxDate ? moment.tz(params.query.maxDate, 'DD/MM/YYYY', 'GMT'): moment().tz('GMT').add(1, 'year')
					, status : _.isString(params.query.status) ? params.query.status : null
				}
				if(!(query.minDate.isValid() && query.maxDate.isValid()))
					return sendError(errors.invalidDates, 4099, callback)
				if(query.maxDate.isBefore(query.minDate))
					return sendError(errors.invalidDates, 4099, callback)

				switch(query.eventType.toLowerCase()) {
				case('leave'):

					var jsonObject = []

					_.forEach(calendar.events, function (value) {

						if(value.eventType.toLowerCase() !== 'leave')
							return true
						if(moment(value.end.date).isBefore(query.minDate))
							return true
						if(moment(value.start.date).isAfter(query.maxDate))
							return true
						if((query.status) && (query.status !== value.leaveDetails.status))
							return true

						let json = eventBuilder(value)
						jsonObject.push(json)
					})

					let jsonBuilder = {
						events: jsonObject
					}
					callback(err, jsonBuilder)
				}
			}

			var eventRetriever = function () {

				var currentEvent = _.findLast(calendar.events, function (value) {
					return value._id.toString() === params.query.eventId
				})
				if(!currentEvent)
					return sendError(errors.invalidEventId, 4099, callback)

				else if(currentEvent) {

					var json = eventBuilder(currentEvent)
					json.conversation = []

					if(_.isString(params.query.sinceConversationTime)) {
						var sinceConversationTime = moment(params.query.sinceConversationTime)
						if(!sinceConversationTime.isValid())
							return sendError(errors.invalidDates, 4099, callback)
					}

					_.forEach(currentEvent.conversation, function (value) {						
						if((sinceConversationTime) && (sinceConversationTime >= moment(value.time)))
							return true
						json.conversation.push({
							comment: value.comment
							, author: value.author
							, time: value.time
						})
					})

					_.forEach(currentEvent.attendees, function (value) {
						if (value.email === email) {
							json.actions = value.actions
							return false
						}
					})

					let jsonBuilder = {
						event: json
					}

					notificationModel.markReadInternal(err, {
						email: email,
						actionId: crypto.createHash('md5').update(`${calendarId}:${currentEvent._id}`).digest('hex')
					})

					callback(err, jsonBuilder)
				}
			}

			var eventBuilder = function (curr) {

				var json = {
					id: curr._id
					, status: curr.leaveDetails.status
					, reason: curr.leaveDetails.reason
				}

				if(moment(curr.end.date).diff(moment(curr.start.date), 'd') > 1) {
					json.from = moment.tz(curr.start.date, 'GMT').format('MMM DD YYYY')
					json.to = moment.tz(curr.end.date, 'GMT').subtract(1, 'd').format('MMM DD YYYY')
				}
				else
					json.date = moment.tz(curr.start.date, 'GMT').format('MMM DD YYYY')

				return json
			}

			if(calendar)
				accessRightsValidator()

			else if((!calendar) && (calendarId === email))
				createCalendar(email, function (err, newCalendar) {
					if(err)
						return callback(err)
					calendar = newCalendar
					accessRightsValidator()
				})

			else
				return sendError(errors.calendarNotFound, 4002, callback)

		})

	})

}

calendarModelInterface.editEvent = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		var calendarId = email
		if((_.isString(params.body.calendarId)) && (params.body.calendarId !== email))
			calendarId = params.body.calendarId

		calendarModel.findOne({
			calendarId: calendarId
		},
		'events counters calendarId',
		function (err, calendar) {

			if(err)
				return sendError(err, 4001, callback)

			else if(calendar) {

				var consumer
					, notificationObject = {}
					, startDate
					, endDate

				if(!_.isString(params.body.eventId))
					return sendError(errors.invalidEventId, 4099, callback)

				var currentEvent = _.findLast(calendar.events, function (value) {
					return value._id.toString() === params.body.eventId
				})
				if(!currentEvent)
					return sendError(errors.invalidEventId, 4099, callback)

				var attendees = currentEvent.attendees
				var eventEditor = _.findIndex(attendees, function (value) {
					return value.email === email
				})

				var router = function () {

					consumer = +(!eventEditor)
					if(attendees[consumer])
						notificationObject = {
							authHeader: params.authHeader
							, creator: email
							, calendarId: calendarId
							, consumer: attendees[consumer].email
							, title: attendees[eventEditor].publicDetails.displayName
							, eventId: currentEvent._id
							, pictureURL: attendees[eventEditor].publicDetails.pictureURL
						}

					if(_.isString(params.body.comments)) {
						pushComment()
					}

					else if(_.isString(params.body.leaveStatus)) {
						if((_.map(attendees[eventEditor].actions, function (value) {return value.leaveStatus.toLowerCase()}).indexOf(params.body.leaveStatus.toLowerCase())) === -1)
							return sendError(sprintf(errors.accessRights, email, calendarId, params.body.leaveStatus), 4099, callback)
						else
							updateStatus()
					}

					else if((params.body.from) && (params.body.to)) {
						if(attendees[eventEditor].self !== true)
							return sendError(sprintf(errors.accessRights, email, currentEvent._id, 'change dates'), 4099, callback)
						startDate = params.body.from
						endDate = params.body.to
						updateDate()
					}

					else if(params.body.date) {
						if(attendees[eventEditor].self !== true)
							return sendError(sprintf(errors.accessRights, email, currentEvent._id, 'change dates'), 4099, callback)
						startDate = params.body.date
						endDate = params.body.date
						updateDate()
					}

					else
						return sendError(errors.invalidInputs, 4099, callback)

				}

				var saveCalendar = function () {
					calendar.save(function (err) {

						if(err)
							return sendError(err, 4001, callback)

						let jsonBuilder = {
							eventId: currentEvent._id
						}

						callback(err, jsonBuilder)

						calendarAsync.notification(notificationObject)
						calendarAsync.salesforce({
							calendar: calendar.toJSON(),
							eventId: currentEvent._id,
							verb: 'update'
						})

						return

					})

				}

				var updateDate = function () {

					startDate =  moment.tz(startDate, 'DD/MM/YYYY', 'GMT')
					endDate =  moment.tz(endDate, 'DD/MM/YYYY', 'GMT').add(1, 'd')

					leaveValidator({
						startDate: startDate,
						endDate: endDate,
						events: calendar.events
						, role: currentEvent.attendees[0].publicDetails.role
						, location: currentEvent.attendees[0].publicDetails.location
					}, function (err, countDays) {

						if(err)
							return callback(err)

						if(countDays === 1)
							notificationObject.body = sprintf(notificationText.leaveUpdate, startDate.format('MMM DD'))
						else if(countDays > 1) {
							let visualEndDate = moment(endDate).subtract(1, 'd')
							visualEndDate = visualEndDate.isAfter(startDate, 'months') ? visualEndDate.format('MMM DD'): visualEndDate.format('DD')
							notificationObject.body = sprintf(notificationText.leaveUpdate, `${startDate.format('MMM DD')} to ${visualEndDate}`)
						}

						currentEvent.start.date = startDate
						currentEvent.end.date = endDate
						currentEvent.conversation.push({
							comment: sprintf(botComments.leaveUpdate, attendees[eventEditor].publicDetails.displayName)
							, author: bot
							, time: Date.now()
						})

						currentEvent.attendees[0].actions = [{leaveStatus: 'cancelled'}]
						currentEvent.attendees[1].actions = [{leaveStatus: 'approved'}, {leaveStatus: 'rejected'}]

						calendar.counters.leaveCounter.leaveCount += (countDays - currentEvent.leaveDetails.countDays)

						currentEvent.leaveDetails.countDays = countDays
						currentEvent.leaveDetails.status = 'Pending'

						notificationObject.status = 'pending'
						notificationObject.actions = ['Approve', 'Details']

						saveCalendar()
					})
				}

				var pushComment = function () {

					currentEvent.conversation.push({
						comment: params.body.comments
						, author: attendees[eventEditor].publicDetails
						, time: Date.now()
					})

					notificationObject.body = params.body.comments
					notificationObject.status = 'unread'

					saveCalendar()
				}

				var updateStatus = function () {

					switch(params.body.leaveStatus.toLowerCase()) {
					case('cancelled'):

						currentEvent.conversation.push({
							comment: sprintf(botComments.leaveCancel, attendees[eventEditor].publicDetails.displayName)
							, author: bot
							, time: Date.now()
						})

						calendar.counters.leaveCounter.leaveCount -= currentEvent.leaveDetails.countDays
						currentEvent.leaveDetails.countDays = 0

						currentEvent.attendees[0].actions = []
						currentEvent.attendees[1].actions = []

						notificationModel.markDone(err, {
							email: notificationObject.consumer
							, actionId: crypto.createHash('md5').update(`${notificationObject.calendarId}:${notificationObject.eventId}`).digest('hex')
							, self: false
						})
						notificationObject.body = notificationText.leaveCancel
						notificationObject.status = 'unread'
						break

					case('approved'):

						currentEvent.conversation.push({
							comment: sprintf(botComments.leaveApprove, attendees[eventEditor].publicDetails.displayName)
							, author: bot
							, time: Date.now()
						})

						currentEvent.attendees[0].actions = [{leaveStatus: 'cancelled'}]
						currentEvent.attendees[1].actions = []

						notificationModel.markDone(err, {
							email: email
							, actionId: crypto.createHash('md5').update(`${notificationObject.calendarId}:${notificationObject.eventId}`).digest('hex')
							, self: true
						})
						notificationObject.body = notificationText.leaveApprove
						notificationObject.status = 'unread'
						break

					case('rejected'):

						currentEvent.conversation.push({
							comment: sprintf(botComments.leaveReject, attendees[eventEditor].publicDetails.displayName)
							, author: bot
							, time: Date.now()
						})

						calendar.counters.leaveCounter.leaveCount -= currentEvent.leaveDetails.countDays
						currentEvent.leaveDetails.countDays = 0

						currentEvent.attendees[0].actions = []
						currentEvent.attendees[1].actions = []

						notificationModel.markDone(err, {
							email: email
							, actionId: crypto.createHash('md5').update(`${notificationObject.calendarId}:${notificationObject.eventId}`).digest('hex')
							, self: true
						})
						notificationObject.body = notificationText.leaveReject
						notificationObject.status = 'unread'
						break
					}

					currentEvent.leaveDetails.status = _.capitalize(params.body.leaveStatus)
					saveCalendar()
				}

				if(eventEditor === -1) {
					userModel.retrieveUserDetails(err, {email: calendarId, query: 'managerEmail'}, function (err, managerEmail) {

						if(managerEmail === email) {

							userModel.retrieveUserDetails(err, {email: managerEmail, query: 'publicDetails'}, function (err, publicDetails) {

								let actions

								if(_.isObject(currentEvent.attendees[1]))
									actions = currentEvent.attendees[1].actions

								else {

									if(currentEvent.leaveDetails.status.toLowerCase() === 'pending')
										actions = [{leaveStatus: 'approved'}, {leaveStatus: 'rejected'}]
									else
										actions = []

								}

								currentEvent.attendees.splice(1, 0, {
									email: email
									, publicDetails: publicDetails
									, actions: actions
								})

								eventEditor = 1

								router()

							})
						}
								
						else
							return sendError(sprintf(errors.accessRights, email, currentEvent._id, 'write'), 4099, callback)
					})
				}

				else
					router()

			}

			else if(!calendar)
				return sendError(sprintf(errors.calendarNotFound, email), 4002, callback)
		})
	})
}

var createCalendar =  function (params, callback) {

	var calendarId
		, leaveCounter = {}

	if(_.isString(params))
		calendarId = params

	else if(_.isObject(params)) {
		calendarId = params.calendarId
		leaveCounter = params.leaveCounter
	}

	var accessRights = [{
		email: calendarId
		, read: true
		, write: true
	}]

	userModel.retrieveUserDetails(null, {email: calendarId, query: ['managerEmail', 'hrManagerEmail', 'salesforceId']}, function (err, userDetails) {

		var builder = function () {

			var query = {calendarId: calendarId}
				, update = {
					counters: {leaveCounter: leaveCounter}
					, accessRights: accessRights
					, salesforceId: userDetails.salesforceId
					, events: []
				}
				, options = {
					upsert: true
					, new: true
				}

			calendarModel.findOneAndUpdate(query, update, options, function (err, calendar) {

				if(err)
					return sendError(err, 4001, callback)

				callback(err, calendar)
			})

		}

		if(err)
			return callback(err)

		if(userDetails.managerEmail)
			accessRights.push({
				email: userDetails.managerEmail
				, read: true
				, write: true
			})
		else
			sendError(sprintf(errors.managerNotFound, calendarId), 4004)

		if(userDetails.hrManagerEmail)
			accessRights.push({
				email: userDetails.hrManagerEmail
				, read: true
				, write: true
			})
		else
			sendError(sprintf(errors.hrManagerNotFound, calendarId), 4004)

		if(Object.getOwnPropertyNames(leaveCounter).length === 0) {

			if(userDetails.salesforceId)
				salesforceAPICalls.retrieveLeaveCounters(err, {salesforceId: userDetails.salesforceId}, function (err, result) {

					if(result)
						leaveCounter = result

					else{
						leaveCounter = {
							leaveCount: 0
							, leaveMax: 0
						}
						sendError(sprintf(errors.leaveCounterMissing, calendarId), 4004)
					}

					builder()

				})

			else {

				leaveCounter = {
					leaveCount: 0
					, leaveMax: 0
				}
				sendError(sprintf(errors.leaveCounterMissing, calendarId), 4004)
				builder()

			}

		}

		else
			builder()

	})

}

calendarModelInterface.applyLeave = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		calendarModel.findOne({
			calendarId: email
		}, 
		function (err, calendar) {

			if(err)
				return sendError(err, 4001, callback)

			if(!_.isString(params.body.reason))
				return sendError(errors.invalidInputs, 4099, callback)

			var id, startDate, endDate, countDays, attendees

			var router = function () {
				if(params.body.date)
					endDate = startDate = params.body.date
				else if((params.body.from) && (params.body.to)) {
					startDate = params.body.from
					endDate = params.body.to
				}
				else
					endDate = startDate = moment.tz('GMT').startOf('day')
				pushEvent()
			}

			var saveCalendar = function () {

				calendar.save(function (err) {

					if(err)
						return sendError(err, 4001, callback)

					let jsonBuilder = {
						eventId: id,
						calendarId: email
					}
					callback(err, jsonBuilder)

					let notificationObject = {
						calendarId: email
						, title: attendees[0].publicDetails.displayName
						, pictureURL: attendees[0].publicDetails.pictureURL
						, creator: email
						, consumer: attendees[1].email
						, authHeader: params.authHeader
						, actions: ['Approve', 'Details']
						, status: 'pending'
						, eventId: id
					}

					if(countDays === 1)
						notificationObject.body = sprintf(notificationText.leaveCreate, startDate.format('MMM DD'))
					else if(countDays > 1) {
						let visualEndDate = moment(endDate).subtract(1, 'd')
						visualEndDate = visualEndDate.isAfter(startDate, 'months') ? visualEndDate.format('MMM DD'): visualEndDate.format('DD')
						notificationObject.body = sprintf(notificationText.leaveCreate, `${startDate.format('MMM DD')} to ${visualEndDate}`)
					}

					if(_.isString(params.body.comments) && (params.body.comments.length > 0))
						notificationObject.body += '\n' + params.body.comments

					calendarAsync.notification(notificationObject)
					calendarAsync.salesforce({
						calendar: calendar
						, eventId: id
						, verb: 'create'
					})

					return

				})

			}

			var pushEvent = function () {

				userModel.retrieveUserDetails(err, {email: email, query: ['managerEmail', 'publicDetails']}, function (err, userJson) {

					if(err)
						return callback(err)

					startDate =  moment.tz(startDate, 'DD/MM/YYYY', 'GMT')
					endDate =  moment.tz(endDate, 'DD/MM/YYYY', 'GMT').add(1, 'd')

					leaveValidator({
						startDate: startDate,
						endDate: endDate,
						events: calendar.events,
						role: userJson.publicDetails.role
						, location: userJson.publicDetails.location
					}, function (err, count) {

						countDays = count

						if(err)
							return callback(err)

						id = mongoose.Types.ObjectId()

						userModel.retrieveUserDetails(err, {email: userJson.managerEmail, query: 'publicDetails'}, function (err, managerPublicDetails) {

							attendees = [{
								email: email
								, self: true
								, publicDetails: userJson.publicDetails
								, actions: [{leaveStatus: 'cancelled'}]
							},{
								email: userJson.managerEmail
								, publicDetails: managerPublicDetails
								, actions: [{leaveStatus: 'approved'}, {leaveStatus: 'rejected'}]
							}]

							if(!userJson.managerEmail) {
								attendees.pop()
								sendError(sprintf(errors.managerNotFound, email), 4004)
							}

							var conversation = []
							if(_.isString(params.body.comments) && (params.body.comments.length > 0)) {
								conversation.push({
									comment: params.body.comments
									, author: userJson.publicDetails
									, time: Date.now()
								})
							}
							conversation.push({
								comment: sprintf(botComments.leaveCreate, userJson.publicDetails.displayName)
								, author: bot
								, time: Date.now()
							})

							calendar.events.push({
								_id: id
								, start: {
									date : startDate
								}
								, end : {
									date: endDate
								}
								, attendees: attendees
								, eventType: 'leave'
								, leaveDetails: {
									status: 'Pending'
									, reason: params.body.reason
									, countDays: countDays
								}
								, conversation: conversation
							})
							calendar.counters.leaveCounter.leaveCount += countDays
							saveCalendar()
						})
					})
				})
			}

			if(calendar)
				router()
			if(!calendar)
				createCalendar(email, function (err, newCalendar) {
					if(err)
						return callback(err)
					calendar = newCalendar
					router()
				})
		})
	})
}

calendarModelInterface.createCalendar = function (err, params, callback) {

	var body = params.body

	var builder = function (obj, callback) {

		let leaveCounter = {}

		if(_.isNumber(obj.leaveCount)) {

			leaveCounter = {
				leaveCount: obj.leaveCount
				, leaveMax: obj.leaveMax? obj.leaveMax: 6
			}

			leaveCounter.leaveAvailable = leaveCounter.leaveMax - leaveCounter.leaveCount
			if(leaveCounter.leaveAvailable < 0)
				leaveCounter.leaveAvailable = 0

		}

		createCalendar({
			calendarId: obj.email
			, leaveCounter: leaveCounter
		}, callback)

	}

	if(_.isArray(body.calendars)) {

		async.each(body.calendars, builder, function (err) {

			if(err)
				return sendError(err.err, err.code, callback)

			return callback()

		})

	}

	else if(_.isObject(body)) {

		createCalendar(body, function (err) {

			if(err)
				return sendError(err.err, err.code, callback)

			return callback()

		})

	}

	else
		return sendError(err, 4099, callback)
}

calendarModelInterface.retrieveCalendar = function (err, params, callback) {
	calendarModel.findOne({
		calendarId: params.calendarId
	}
	, {lean: (params.lean? true: false)}
	, function (err, calendar) {
		return callback(err, calendar)
	})
}

var leaveValidator = function (params, callback) {

	let startDate =  moment.tz(params.startDate, 'DD/MM/YYYY', 'GMT')
		, endDate =  moment.tz(params.endDate, 'DD/MM/YYYY', 'GMT')
		, role = params.role? params.role.toLowerCase(): null
		, location = params.location? params.location.toLowerCase(): null

	if(!(startDate.isValid() && endDate.isValid()))
		return sendError(errors.invalidDates, 4099, callback)
	if((startDate.diff(moment(), 'months') < -1) || (endDate.diff(moment(), 'months') > 5))
		return sendError(errors.invalidDates, 4006, callback)

	var countDays = endDate.diff(startDate, 'days')
	var keys = []
	let keyDate = moment(startDate)
	while(keyDate.isBefore(endDate)) {
		let key = keyDate.format('DDMMYY')
		keys.push(key)
		keyDate.add(1, 'd')
	}

	redisClient.hmget('holidays', keys, function (err, redisResponse) {

		let holidayArray = _.filter(redisResponse, value => {

			if(value === null)
				return false

			if(value === 'all')
				return true

			if(value === location)
				return true

			if(value === role)
				return true

			let roleLocation = role + location
				, val = value.split(',')

			if(val.indexOf(location) > -1)
				return true

			if(val.indexOf(role) > -1)
				return true

			if(val.indexOf(roleLocation) > -1)
				return true

			else
				return false
		})
		, holidayCount = holidayArray.length
		countDays = countDays - holidayCount

		if(countDays < 1)
			return sendError(errors.invalidDates, 4003, callback)

		let conflict = false
		_.forEachRight(params.events, function (value) {

			if((value.eventType.toLowerCase() === 'leave') && (value.leaveDetails.countDays > 0)) {

				let valueEndDate = moment(value.end.date)
				, valueStartDate = moment(value.start.date)
				, valueDuration = valueEndDate.diff(valueStartDate, 'days')
				, startDiff = startDate.diff(valueStartDate, 'days')
				, endDiff = endDate.diff(valueStartDate, 'days')

				if(((startDiff >= 0) && (startDiff < valueDuration)) || ((endDiff > 0) && (endDiff <= valueDuration)))
					conflict = true
				if(conflict)
					return false

			}

		})

		if(conflict)
			return sendError(errors.invalidDates, 4007, callback)

		return callback(err, countDays)
	})
}

var holidayBuilder = function () {

	let i = -60
		, sundayObject = {}

	while( i <= 180) {	//Sundays

		let date = moment.tz('GMT').startOf('day').add(i++, 'd')
		if(moment(date).day() === daysOfWeek.Sunday) {
			let key = date.format('DDMMYY')
			sundayObject[key] = 'all'
		}

	}

	redisClient.hmset('holidays', sundayObject, function (err, redisResponse) {
		if(err || redisResponse !== 'OK')
			sendError(sprintf(errors.redisError, err, redisResponse), 3014)

		redisClient.expire('holidays', holidayTTL)
	})

	googleAPICalls.retrieveHolidays({
		timeMin: moment.tz('Asia/Kolkata').startOf('day').add(-60, 'd').format(),
		timeMax: moment.tz('Asia/Kolkata').startOf('day').add(180, 'd').format()
	}, function (err, holidays) {	//Holidays, Non-working Saturdays

		let holidayObject = {}

		_.forEach(holidays, function (value) {

			let date = moment.tz(value.date, 'YYYY-MM-DD', 'GMT').startOf('day')
			let key = date.format('DDMMYY')
				, val

			switch(value.description.split(':')[0]) {

			case('Non-working'):
				val = 'staff'
				break
			case('Holiday'):
				val = 'staff'
				break
			case('Ahmedabad holiday'):
				val = 'ahmedabad'
				break
			case('Bangalore holiday'):
				val = 'bangalore'
				break
			case('Chennai holiday'):
				val = 'chennai'
				break
			case('Delhi holiday'):
				val = 'delhi'
				break
			case('Hyderabad holiday'):
				val = 'hyderabad'
				break
			case('Mumbai holiday'):
				val = 'mumbai'
				break
			case('Pune holiday'):
				val = 'pune'
				break

			}

			if(holidayObject[key])
				val += `,${holidayObject[key]}`

			holidayObject[key] = val
		})

		redisClient.hmset('holidays', holidayObject, function (err, redisResponse) {

			if(err || redisResponse !== 'OK')
				sendError(sprintf(errors.redisError, err, redisResponse), 3014)

			redisClient.expire('holidays', holidayTTL)
		})

	})

}
'use strict'

const errors = {
		gcmFail: 'no gcm success for %s'
		, canonical: 'canonical_ids for %s: %s'
		, gcmError: 'error: %s, result: %s'
		, notificationCollectionNotFound: 'notificationCollection not found for %s'
		, notificationNotFound: 'notification not found for %s for actionId %s'
		, invalidInput: 'invalid input'
	}
	, restrictedPackageName = 'org.teachforindia.thepath'
	, notifsPerPage = 20
	, inactivityDays = 14

var gcmCalls = require('../services/gcmCalls')

var userModel = require('./userModel')
var sendError = require('./errorHandler').sendError

var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var _ = require('lodash')
var crypto = require('crypto')
var moment = require('moment-timezone')
var sprintf = require('sprintf')

var notificationEventSchema = {
	updateTime: {
		type: Date
	}
	, lastReadTime: {
		type: Date
	}
	, status: {
		type: String
	}
	, actionId: {
		type: String
	}
	, updates: {
		type: Number,
		default: 0
	}
	, data: {
		type: Object
	}
}

var notificationSchema = new Schema({
	email: {
		type: String,
		index: {
			unique: true,
			sparse: true
		},
		trim: true,
		required: true
	},
	counters: {
		pending: {
			unique: {
				type: Number,
				default: 0
			},
			updates: {
				type: Number,
				default: 0
			}
		},
		unread: {
			unique: {
				type: Number,
				default: 0
			},
			updates: {
				type: Number,
				default: 0
			}
		}
	}
	, inactiveNotifications: [notificationEventSchema]
	, notifications: [notificationEventSchema]
})

notificationSchema.pre('save', function (next) {
	if(this.counters.pending.unique < 0)
		this.counters.pending.unique = 0
	if(this.counters.pending.updates < 0)
		this.counters.pending.updates = 0
	if(this.counters.unread.unique < 0)
		this.counters.unread.unique = 0
	if(this.counters.unread.updates < 0)
		this.counters.unread.updates = 0
	next()
})

var notificationModel = mongoose.model('notification', notificationSchema)

var notificationModelInterface = {}
module.exports = notificationModelInterface

var pushNotification = function (email, notificationEvent, callback) {

	notificationModel.findOne({
		email: email
	},
	function (err, notificationCollection) {

		if(err)
			return sendError(err, 6001, callback)

		else if(notificationCollection) {

			var currentNotification = _.findLast(notificationCollection.notifications, function (value) {
				return value.actionId === notificationEvent.actionId
			})

			if(!currentNotification)
				currentNotification = _.findLast(notificationCollection.inactiveNotifications, function (value) {
					return value.actionId === notificationEvent.actionId
				})

			if(!currentNotification) {

				notificationCollection.counters[notificationEvent.status].unique++
				notificationCollection.counters[notificationEvent.status].updates++

				notificationEvent._id = mongoose.Types.ObjectId()
				notificationEvent.data.notificationId = notificationEvent._id
				notificationEvent.data.pushId = moment().format('DDMMYY') + notificationCollection.notifications.length%1000
				notificationCollection.notifications.push(notificationEvent)

				notificationCollection.save(function (err) {

					if(err)
						return sendError(err, 6001, callback)

					return callback(err, notificationEvent.data.pushId)
				})
			}

			else{

				if((currentNotification.status === 'read') && (notificationEvent.status === 'unread'))
					notificationCollection.counters.unread.unique++

				if(currentNotification.status !== 'pending') {
					currentNotification.status = notificationEvent.status
					currentNotification.data.body = notificationEvent.data.body
					notificationCollection.markModified('notifications')
				}

				notificationCollection.counters[currentNotification.status].updates++
				currentNotification.updateTime = notificationEvent.updateTime
				currentNotification.updates++

				notificationCollection.save(function (err) {

					if(err)
						return sendError(err, 6001, callback)

					return callback(err, currentNotification.data.pushId)

				})
			}
		}

		else if(!notificationCollection) {

			let counters = {}
			counters[notificationEvent.status] = {
				unique: 1
				, updates: 1
			}
			notificationCollection = new notificationModel({
				email: email,
				counters: counters
			})

			notificationEvent._id = mongoose.Types.ObjectId()
			notificationEvent.data.notificationId = notificationEvent._id
			notificationEvent.data.pushId = moment().tz('GMT').format('DDMMYY') + notificationCollection.notifications.length%1000
			notificationCollection.notifications.push(notificationEvent)

			notificationCollection.save(function (err) {

				if(err)
					return sendError(err, 6001, callback)

				return callback(err, notificationEvent.data.pushId)

			})
		}

	})
}

var sortAndMove = function (notificationCollection) {

	notificationCollection.notifications.sort(function (a, b) {

		if((a.status === 'pending') && (b.status !== 'pending'))
			return 1
		if((a.status !== 'pending') && (b.status === 'pending'))
			return -1
		else if((a.status === 'unread') && (b.status === 'read'))
			return 1
		else if((a.status === 'read') && (b.status === 'unread'))
			return -1

		return a.updateTime - b.updateTime

	})

	let spliceNumber = 0
		, spliceTime = moment().tz('GMT').subtract(inactivityDays, 'd')

	_.forEach(notificationCollection.notifications, function (value, index) {

		if(value.status.toLowerCase() !== 'read')
			return false

		let currentReadTime = moment(value.lastReadTime)
			, currentUpdateTime = moment(value.updateTime)
			, currentNotificationMoment = (currentReadTime.isAfter(currentUpdateTime)) ? currentReadTime : currentUpdateTime

		if(currentNotificationMoment.isAfter(spliceTime)) {
			spliceNumber = index
			return false
		}

	})

	let splicedArray = notificationCollection.notifications.splice(0, spliceNumber)
	notificationCollection.inactiveNotifications = notificationCollection.inactiveNotifications.concat(splicedArray)

	notificationCollection.save(function (err) {
		if(err)
			sendError(err, 6001)
	})

}

notificationModelInterface.markDone = function (err, params, callback) {

	notificationModel.findOne({
		email: params.email
	},
	function (err, notificationCollection) {

		if(err)
			return sendError(err, 6001, callback)

		else if(notificationCollection) {

			var currentNotification
			currentNotification = _.findLast(notificationCollection.notifications, function (value) {
				return value.actionId === params.actionId
			})

			if(!currentNotification)
				currentNotification = _.findLast(notificationCollection.inactiveNotifications, function (value) {
					return value.actionId === params.actionId
				})
			if(!currentNotification)
				return sendError(sprintf(errors.notificationNotFound, params.email, params.actionId), 6002, callback)

			currentNotification.data.actions = null

			if(currentNotification.status === 'pending') {
				notificationCollection.counters.pending.unique--
				notificationCollection.counters.pending.updates -= (currentNotification.updates+1)
			}
			currentNotification.updates = 0

			if(params.self) {
				currentNotification.lastReadTime = moment.tz('GMT')
				currentNotification.status = 'read'
			}

			else {

				if(currentNotification.status !== 'unread')
					notificationCollection.counters.unread.unique++
				currentNotification.status = 'unread'
			}

			notificationCollection.markModified('notifications')
			notificationCollection.save(function (err) {
				if(err)
					return sendError(err, 6001, callback)
				return
			})
		}

		else if(!notificationCollection)
			return sendError(sprintf(errors.notificationCollectionNotFound, params.email), 6002, callback)

	})
}

notificationModelInterface.markReadInternal = function (err, params, callback) {

	notificationModel.findOne({email: params.email}, function (err, notificationCollection) {

		if(err)
			return sendError(err, 4001, callback)

		if(notificationCollection) {

			var currentNotification

			currentNotification = _.findLast(notificationCollection.notifications, function (value) {
				return value.actionId === params.actionId
			})
			if(!currentNotification)
				currentNotification = _.findLast(notificationCollection.inactiveNotifications, function (value) {
					return value.actionId === params.actionId
				})
			if(!currentNotification)
				return sendError(sprintf(errors.notificationNotFound, params.email, params.actionId), 6002, callback)

			currentNotification.lastReadTime = moment.tz('GMT')

			if(currentNotification.status === 'unread') {
				notificationCollection.counters[currentNotification.status].unique--
				notificationCollection.counters[currentNotification.status].updates -= (currentNotification.updates+1)
				currentNotification.status = 'read'
				currentNotification.updates = 0
			}

			else if(currentNotification.status === 'pending') {
				notificationCollection.counters[currentNotification.status].updates -= (currentNotification.updates+1)
				currentNotification.updates = 0
			}

			sortAndMove(notificationCollection)

		}

		else if(!notificationCollection)
			return sendError(sprintf(errors.notificationCollectionNotFound, params.email), 6002, callback)
	})
}

notificationModelInterface.markRead = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		notificationModel.findOne({
			email: email
		},
		function (err, notificationCollection) {

			if(err)
				return sendError(err, 6001, callback)

			else if(!_.isString(params.body.status))
				return sendError(errors.invalidInput, 6099, callback)

			else if(notificationCollection) {

				var currentNotification

				if(_.isString(params.body.notificationId)) {
					currentNotification = _.findLast(notificationCollection.notifications, function (value) {
						return value._id.toString() === params.body.notificationId
					})
					if(!currentNotification)
						currentNotification = _.findLast(notificationCollection.inactiveNotifications, function (value) {
							return value._id.toString() === params.body.notificationId
						})
				}

				else if(_.isString(params.body.actionId)) {
					currentNotification = _.findLast(notificationCollection.notifications, function (value) {
						return value.actionId === params.body.actionId
					})
					if(!currentNotification)
						currentNotification = _.findLast(notificationCollection.inactiveNotifications, function (value) {
							return value._id === params.body.notificationId
						})
				}

				if(!currentNotification)
					return sendError(errors.invalidInput, 6099, callback)

				currentNotification.lastReadTime = moment.tz('GMT')

				if(currentNotification.status === 'unread') {
					if(params.body.status.toLowerCase() === 'read') {
						notificationCollection.counters[currentNotification.status].unique--
						notificationCollection.counters[currentNotification.status].updates -= (currentNotification.updates+1)
						currentNotification.status = 'read'
						currentNotification.updates = 0
						callback(err)
					}
				}

				else if(currentNotification.status === 'pending') {
					if(params.body.status.toLowerCase() === 'read') {
						notificationCollection.counters[currentNotification.status].updates -= (currentNotification.updates+1)
						currentNotification.updates = 0
						callback(err)
					}
				}

				else
					callback(err)

				sortAndMove(notificationCollection)

			}

			else if(!notificationCollection)
				return sendError(errors.invalidInput, 6099, callback)

		})
	})
}

notificationModelInterface.leaveNotification = function (err, json, callback) {

	userModel.retrieveUserDetails(err, {email: json.consumer, query: 'gcmRegistrationIds'}, function (err, registrationIds) {

		if(err)
			return callback(err)

		var message = {
			priority: 'high',
			restrictedPackageName: restrictedPackageName,
			data: {
				title: json.title,
				body: json.body,
				eventId: json.eventId,
				calendarId: json.calendarId,
				imageURL: json.pictureURL,
				actions: json.actions,
				consumer: json.consumer
			}
		}

		pushNotification(json.consumer, {
			updateTime: moment.tz('GMT'),
			status: json.status.toLowerCase(),
			actionId: crypto.createHash('md5').update(json.calendarId + ':' + json.eventId).digest('hex'),
			data: message.data
		}, function (err, pushId) {

			if(err)
				return callback(err)

			message.data.pushId = pushId

			gcmCalls.leaveNotification(err, {message: message, registrationIds: registrationIds, authHeader: json.authHeader}, function (err, result) {

				if(err || !(result))
					sendError(sprintf(errors.gcmError, err, result), 6005)

				if(result) {
					if(result.success === 0)
						sendError(sprintf(errors.gcmFail, json.consumer), 6003)
					if(result.canonical_ids !== 0)
						sendError(sprintf(errors.canonical, json.consumer, result.canonical_ids), 6004)

					let spliced = 0
					_.forEach(result.results, function (value, index) {
						if((value.error === 'NotRegistered') || (value.error === 'InvalidRegistration'))
							registrationIds.splice((index - spliced++), 1)
					})

					userModel.updateUserInternal(err, {email: json.consumer, query: 'gcmRegistrationIds', gcmRegistrationIds: registrationIds}, function (err) {
						return callback(err, result)
					})

				}

				return

			})
		})			
	})
}

notificationModelInterface.retrieveNotifications = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		var projection

		if(!_.isString(params.query.inactivePage))
			projection = 'notifications'
		else if(parseInt(params.query.inactivePage) > 0)
			projection = 'inactiveNotifications'
		else
			return sendError(errors.invalidInput, 6099, callback)

		notificationModel.findOne({email: email}, projection, {lean: true}, function (err, notificationCollection) {
			if(err)
				return sendError(err, 6001, callback)

			if(notificationCollection) {

				if(!params.query.inactivePage) {

					let json = []

					if(_.isString(params.query.sinceNotificationTime))
						var sinceNotificationTime = moment(params.query.sinceNotificationTime)
					if(_.isString(params.query.returnRead) && (params.query.returnRead === 'true'))
						var returnRead = true

					_.forEachRight(notificationCollection.notifications, function (value) {

						if((!returnRead) && (value.status.toLowerCase() === 'read'))
							return true
						if((sinceNotificationTime) && (sinceNotificationTime >= value.updateTime))
							return true

						json.push({
							notificationId: value._id,
							updateTime: value.updateTime,
							data: value.data,
							status: value.status,
							updates: value.updates
						})

					})

					let jsonBuilder = {
						notifications: json
					}
					return callback(err, jsonBuilder)
				}

				else{

					let json = []
						, size = notificationCollection.inactiveNotifications.length
						, inactivePage = parseInt(params.query.inactivePage)

					_.forEachRight(notificationCollection.inactiveNotifications, function (value, index) {

						if((size-index) < ((inactivePage-1)*notifsPerPage))
							return true
						else if((size-index) >= (inactivePage*notifsPerPage))
							return false

						json.push({
							notificationId: value._id,
							updateTime: value.updateTime,
							data: value.data,
							status: value.status,
							updates: value.updates
						})

					})

					let jsonBuilder = {
						inactiveNotifications: json
					}
					return callback(err, jsonBuilder)
				}
			}

			else if(!notificationCollection)
				return callback(err, 6002, callback)

		})
	})
}

notificationModelInterface.retrieveCounters = function (err, params, callback) {

	userModel.verifyUserToken(err, params.authHeader, function (err, email) {

		if(err)
			return callback(err)

		notificationModel.findOne({email: email}, 'counters', {lean: true}, function (err, notificationCollection) {

			if(err)
				return sendError(err, 6001, callback)

			var respond = function () {
				let jsonBuilder = {
					notificationsCounter: notificationCollection.counters
				}
				return callback(err, jsonBuilder)
			}

			if(notificationCollection)
				respond()

			else if(!notificationCollection) {

				notificationCollection = new notificationModel({
					email: email
				})
				notificationCollection.save(function (err, newCollection) {
					notificationCollection = newCollection
					respond()
				})

			}

		})
	})
}
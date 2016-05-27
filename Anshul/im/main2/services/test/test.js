'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const crypto = require('crypto')
const moment = require('moment')

const config = require('../configs/variables/testConfig.json')

var server = config.server
	, clientId = config.clientId
	, apiKey = config.apiKey
	, teachPIRefreshTokenUser = config.teachPIRefreshTokenUser
	, teachPIRefreshTokenManager = config.teachPIRefreshTokenManager
	, calendarId = config.calendarId

var bunyan = require('bunyan')
var log = bunyan.createLogger({
	name: 'TeachPI Test',
	streams: [{
		level: 'trace',
		path: './logs/test.log'
	}
	, {
		level: 'debug',
		stream: process.stdout
	}]
})

let authKey = new Buffer(apiKey + ':' + clientId).toString('base64')
var authHeader = 'Basic ' + authKey

var request = chai.request(server)
var body, authHeaderWAToken, authHeaderWATokenManager, eventId

afterEach(function() {
	if(this.currentTest.state === 'failed') {
		log.debug(body)
	}
})

describe('status checks', function() {

	this.timeout(6000)

	it('tries to access the API without credentials', function (done) {

		request
			.get('/status')
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(5005)
				done()
			})

	})

	it('tries to access the API with invalid credentials', function (done) {

		request
			.get('/user/publicDetails')
			.set('Authorization', 'yahoo')
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(5005)
				done()
			})

	})

	it('tries to access the API with invalid credentials', function (done) {

		request
			.post('/user/sessions')
			.set('Authorization', 'Basic Yahoo')
			.send({'authCode':'abcd'})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(5005)
				done()
			})

	})

	it('tries to get the status of the API', function (done) {

		request
			.get('/status')
			.set('Authorization', authHeader)
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				expect(response.res.body.status).to.equal('All Good :)')
				done()
			})

	})

})

describe('/user tests', function () {

	this.timeout(10000)

	before('try to refresh tokens for users', function (done) {

		let authKeyR = new Buffer(apiKey + ':' + clientId + ':' + teachPIRefreshTokenUser).toString('base64')
		let authHeaderWRToken = 'Basic ' + authKeyR

		request
			.get('/user/tokens')
			.set('Authorization', authHeaderWRToken)
			.end(function (err, response) {
				body = response.res.body
				let teachPIAccessToken = response.res.body.teachPIAccessToken
				let authKeyA = new Buffer(apiKey + ':' + clientId + ':' + teachPIAccessToken).toString('base64')
				authHeaderWAToken = 'Basic ' + authKeyA
				expect(response.res.body.errors).to.equal('no')
				expect(teachPIAccessToken).to.be.a('string')
				expect(teachPIAccessToken.length).to.equal(300)
			})

		authKeyR = new Buffer(apiKey + ':' + clientId + ':' + teachPIRefreshTokenManager).toString('base64')
		authHeaderWRToken = 'Basic ' + authKeyR

		request
			.get('/user/tokens')
			.set('Authorization', authHeaderWRToken)
			.end(function (err, response) {
				body = response.res.body
				let teachPIAccessToken = response.res.body.teachPIAccessToken
				let authKeyA = new Buffer(apiKey + ':' + clientId + ':' + teachPIAccessToken).toString('base64')
				authHeaderWATokenManager = 'Basic ' + authKeyA
				expect(response.res.body.errors).to.equal('no')
				expect(teachPIAccessToken).to.be.a('string')
				expect(teachPIAccessToken.length).to.equal(300)
				done()
			})

	})	

	it('tries to create a new user with low access key', function (done) {

		request
			.put('/user')
			.set('Authorization', authHeader)
			.send({})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(5004)
				done()
			})

	})

	it('tries to create a new user session with invalid code', function (done) {

		request
			.post('/user/sessions')
			.set('Authorization', authHeader)
			.send({'authCode':'abcd'})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(2001)
				done()
			})

	})

	it.skip('tries to create a new user session with a valid code', function (done) {

		request
			.post('/user/sessions')
			.set('Authorization', authHeader)
			.send({'authCode':'#'})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				expect(response.res.body.tokens).to.be.an('object')
				expect(response.res.body.tokens.teachPIAccessToken).to.be.a('string')
				expect(response.res.body.tokens.teachPIRefreshToken).to.be.a('string')
				expect(response.res.body.tokens.teachPIAccessToken.length).to.equal(300)
				expect(response.res.body.tokens.teachPIRefreshToken.length).to.equal(280)
				done()
			})

	})

	it('tries to post gcmRegistrationTokens for a user', function (done) {

		request
			.post('/user/gcmRegistrationTokens')
			.set('Authorization', authHeaderWATokenManager)
			.send({'registration_token':'dummy'})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				done()
			})

	})

	it('tries to get Public Details for a user', function (done) {

		request
			.get('/user/publicDetails')
			.set('Authorization', authHeaderWAToken)
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				expect(response.res.body.publicDetails).to.be.an('object')
				expect(response.res.body.publicDetails.pictureURL).to.be.a('string')
				expect(response.res.body.publicDetails.firstName).to.be.a('string')
				expect(response.res.body.publicDetails.lastName).to.be.a('string')
				done()
			})

	})

	describe('/calendar tests', function () {

		this.timeout(10000)

		before('try to apply for leave', function (done) {

			let date = moment()
			if(date.day === 0)
				date.add(1, 'day')

			request
				.put('/calendar/events')
				.set('Authorization', authHeaderWAToken)
				.send({'date': date.format('DD/MM/YYYY'), 'eventType':'Leave', 'reason': 'Illness'})
				.end(function (err, response) {
					body = response.res.body
					eventId = response.res.body.eventId
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.eventId).to.be.a('string')
					done()
				})

		})

		it('tries to apply for leave on same date', function (done) {

			request
				.put('/calendar/events')
				.set('Authorization', authHeaderWAToken)
				.send({'date':'2/2/2016', 'eventType':'Leave', 'reason': 'Illness'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.equal(4007)
					done()
				})

		})

		it('tries to apply for a leave on Sunday', function (done) {

			request
				.put('/calendar/events')
				.set('Authorization', authHeaderWAToken)
				.send({'date': '27/12/2015', 'eventType': 'Leave', 'reason': 'I am really sick'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.equal(4003)
					done()
				})

		})

		it('tries to comment on a leave', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWAToken)
				.send({'eventId': eventId, 'comments': 'I am really sick'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.eventId).to.be.a('string')
					expect(response.res.body.eventId).to.equal(eventId)
					done()
				})

		})

		it('tries to comment a leave w/o calendarId - manager', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWATokenManager)
				.send({'eventId': eventId, 'comments': 'Why do you want a leave'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.satisfy(function (errorCode) {
						return (errorCode === 4099 || errorCode === 4002)
					})
					done()
				})		

		})

		it('tries to comment on a leave - manager', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWATokenManager)
				.send({'calendarId': calendarId, 'eventId': eventId, 'comments': 'Why do you want a leave'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.eventId).to.be.a('string')
					expect(response.res.body.eventId).to.equal(eventId)
					done()
				})

		})

		it('tries to approve a leave', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWATokenManager)
				.send({'calendarId': calendarId, 'eventId': eventId, 'leaveStatus': 'Approved'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.eventId).to.be.a('string')
					expect(response.res.body.eventId).to.equal(eventId)
					done()
				})		

		})

		it('tries to reject an approved leave', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWATokenManager)
				.send({'calendarId': calendarId, 'eventId': eventId, 'leaveStatus': 'Rejected'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.equal(4099)
					done()
				})

		})

		it('tries to fetch an approved leave', function (done) {

			request
				.get('/calendar/events?eventId=' + eventId)
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.event).to.be.an('object')
					expect(response.res.body.event.id).to.equal(eventId)
					expect(response.res.body.event.status).to.equal('Approved')
					expect(response.res.body.event.conversation).to.be.an('array')
					done()
				})

		})

		it('tries to cancel a leave', function (done) {

			request
				.post('/calendar/events')
				.set('Authorization', authHeaderWAToken)
				.send({'eventId': eventId, 'leaveStatus': 'Cancelled'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.eventId).to.be.a('string')
					done()
				})		

		})

		it('tries to fetch all leaves', function (done) {

			request
				.get('/calendar/events?eventType=Leave')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.events).to.be.an('array')
					done()
				})

		})

		it.skip('tries to fetch pending leaves', function (done) {

			request
				.get('/calendar/events?eventType=Leave&status=Pending')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.events).to.be.an('array')
					expect(response.res.body.events.length).to.equal(0)
					done()
				})

		})

		it('tries to fetch leaves specifying invalid minDate and maxDate', function (done) {

			request
				.get('/calendar/events?eventType=Leave&minDate=31/11/2015')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.equal(4099)
					done()
				})

		})

		it('tries to fetch leaves specifying invalid minDate and maxDate', function (done) {

			request
				.get('/calendar/events?eventType=Leave&minDate=30/11/2015&maxDate=29/11/2015')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('yes')
					expect(response.res.body.errorCode).to.equal(4099)
					done()
				})

		})

		it('tries to fetch leaves with minDate', function (done) {

			request
				.get('/calendar/events?eventType=Leave&minDate=2/3/2016')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.events).to.be.an('array')
					expect(response.res.body.events.length).to.equal(0)
					done()
				})

		})

		it('tries to fetch a cancelled leave', function (done) {

			request
				.get('/calendar/events?eventId=' + eventId)
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.event).to.be.an('object')
					expect(response.res.body.event.id).to.equal(eventId)
					expect(response.res.body.event.status).to.equal('Cancelled')
					expect(response.res.body.event.conversation).to.be.an('array')
					done()
				})

		})

		it.skip('tries to fetch leaveCounter', function (done) {

			request
				.get('/calendar/counter/leaveCounter')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.leaveCounter).to.be.an('object')
					expect(response.res.body.leaveCounter.leaveMax).to.equal(6)
					expect(response.res.body.leaveCounter.leaveCount).to.be.a('number')
					done()
				})

		})

	})

	describe('/notifications tests', function () {

		this.timeout(6000)
		var notificationId, notificationsCount

		it('tries to fetch notifications counter', function (done) {

			request
				.get('/notifications/counters')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.notificationsCounter).to.be.an('object')
					expect(response.res.body.notificationsCounter.pending).to.be.an('object')
					expect(response.res.body.notificationsCounter.unread).to.be.an('object')
					done()
				})

		})

		it('tries to fetch notifications', function (done) {

			request
				.get('/notifications')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.notifications).to.be.an('array')
					notificationsCount = response.res.body.notifications.length
					if(notificationsCount > 0)
						notificationId = response.res.body.notifications[0].notificationId
					done()
				})

		})

		if(notificationId)
			it('tries to mark a notification as read - notificationId', function (done) {

				request
					.post('/notifications')
					.set('Authorization', authHeaderWAToken)
					.send({'notificationId': notificationId, 'status': 'Read'})
					.end(function (err, response) {
						body = response.res.body
						expect(response.res.body.errors).to.equal('no')
						done()
					})

			})

		it('tries to mark a notification as read - actionId', function (done) {

			let actionId = crypto.createHash('md5').update(calendarId + ':' + eventId).digest('hex')

			request
				.post('/notifications')
				.set('Authorization', authHeaderWAToken)
				.send({'actionId': actionId, 'status': 'Read'})
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					done()
				})

		})

		it('tries to fetch notifications again', function (done) {

			request
				.get('/notifications')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.notifications).to.be.an('array')
					expect(response.res.body.notifications.length).to.be.at.most(notificationsCount)
					done()
				})

		})

		it('tries to fetch read notifications also', function (done) {

			request
				.get('/notifications?returnRead=true')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.notifications).to.be.an('array')
					expect(response.res.body.notifications.length).to.be.above(notificationsCount-1)
					done()
				})

		})

		it('tries to fetch inactive notifications', function (done) {

			request
				.get('/notifications?inactivePage=1')
				.set('Authorization', authHeaderWAToken)
				.end(function (err, response) {
					body = response.res.body
					expect(response.res.body.errors).to.equal('no')
					expect(response.res.body.inactiveNotifications).to.be.an('array')
					expect(response.res.body.inactiveNotifications.length).to.be.at.most(20)
					done()
				})

		})

	})

})

describe('/key tests', function () {

	it('tries to create a new api key with low access key', function (done) {

		request
			.put('/key')
			.set('Authorization', authHeader)
			.send({})
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errorCode).to.equal(5004)
				done()
			})

	})

	it('tries to fetch scopes', function (done) {

		request
			.get('/key/scopes')
			.set('Authorization', authHeader)
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				expect(response.res.body.scopes).to.be.an('array')
				done()
			})

	})

	it('tries to fetch gcmSenderId', function (done) {

		request
			.get('/key/gcmSenderId')
			.set('Authorization', authHeader)
			.end(function (err, response) {
				body = response.res.body
				expect(response.res.body.errors).to.equal('no')
				expect(response.res.body.gcmSenderId).to.be.a('string')
				done()
			})

	})

})
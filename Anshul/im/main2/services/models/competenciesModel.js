'use strict'

const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const _ = require('lodash')
	, async = require('async')
	, sprintf = require('sprintf')

const userModel = require('./userModel')

const sendError = require('./errorHandler').sendError

const conversationSchema = new Schema({
	comment: {
		type: String
	},
	time: {
		type: Date
	},
	author: {
		email: String,
		displayName: String,
		pictureURL: String
	}
})

const competencySchema = new Schema({
	email: {
		type: String,
		required: true
	},
	competencyName: {
		type: String,
		required: true
	},
	accessRights: [{
		email: {
			type: String,
			required: true
		},
		read: {
			type: Boolean
		},
		write: {
			type: Boolean
		},
		actions: []
	}],
	conversation: [conversationSchema],
	currentPriority: {
		type: Boolean
	}
})

competencySchema.index({email: 1, competencyName: 1}, {unique: true})

const competencyModel = mongoose.model('competencies', competencySchema)

module.exports = {

	/**
	 * fetch competencies details for fellow(s)
	 * @param  {[type]}   err      [description]
	 * @param  {[object]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[object]}            [description]
	 */
	getCompetencies: (err, params, callback) => {

		let email = params.authHeader.email,
			fellowEmail = email

		if(params.fellowEmail !== undefined)
			fellowEmail = params.fellowEmail

	
		competencyModel.find({
			email: fellowEmail
		},
		(err, competencies) => {

			if(err)
				return sendError(err)

			/**
			 * function definitions
			 */

			const hasAccess = (competency, cb) => {

				let reader = _.findIndex(competency.accessRights, value => {
					return ((value.email === email) && (value.read === true))
				})

				if(reader === -1) {

					userModel.retrieveUserDetails(err, {email: email, query: 'managerEmail'}, (err, managerEmail) => {

						if(managerEmail === email) {

							competencies.accessRights.push({
								email: email,
								read: true,
								write: true
							})
							competencies.save(err => {
								if(err)
									sendError(err, 4001)
							})

							return cb(true)

						}

						else
							return cb(false)

					})
					
				}

				else
					return cb(true)
	
			}

			/**
			 * routing starts here
			 */
			
			let competenciesDetails = [],
				competenciesList = []

			async.each(competencies, (competency, cb) => {

				hasAccess(competency, hasAccess => {

					if(hasAccess) {
						competenciesDetails.push({
							competencyName: _.capitalize(competency.competencyName),
							conversation: competency.conversation,
							priority: competency.currentPriority
						})

					}

					else
						sendError(sprintf(errors.accessRights, email, fellowEmail, 'read'), 4099)

					cb()

				})

			}, err => {

				competenciesDetails.sort(competency => competency.priority? -1: 1)
				competenciesList = _.map(competenciesDetails, competency => competency.competencyName)

				let jsonBuilder = {
					competencies: competenciesDetails,
					competenciesList: competenciesList
				}

				return callback(err, jsonBuilder)

			})

		})

	},

	/**
	 * [update competencies document for a fellow]
	 * @param  {[type]}   err      []
	 * @param  {[type]}   params   []
	 * @param  {Function} callback [description]
	 * @return {[object]}            []
	 */
	updateCompetencies: (err, params, callback) => {

		let email = params.authHeader.email

		let fellowEmail = params.fellowEmail,
			competencyName = params.competencyName

		competencyModel.findOne({
			$and: [
				{email: fellowEmail},
				{competencyName: competencyName}
			]
		}, (err, object) => {

			if(err)
				return sendError(err, 3001, callback)

			if(!object)
				return sendError(err, 3011, callback)

			let writer = _.find(object.accessRights, value => {
				return ((value.email === email) && (value.write === true))
			})

			/*
			function definitions
			 */
			
			const hasAccess = (cb) => {

				if(!writer) {

					userModel.retrieveUserDetails(err, {email: email, query: 'managerEmail'}, (err, managerEmail) => {

						if(managerEmail === email) {

							object.accessRights.push({
								email: email,
								read: true,
								write: true
							})
							object.save(err => {
								if(err)
									sendError(err, 4001)
							})

							return cb(true)

						}

						else
							return cb(false)

					})
					
				}

				else
					return cb(true)

			}
			
			const saveObject = () => {

				object.save(err => {
					if(err)
						return sendError(err, 1111, callback)
					return callback(err)
				})

			}

			const pushComment = () => {

				let commentsObject = {
					comment: params.comments,
					time: Date.now(),
					author: {
						email: email
					}
				}
				object.conversation.push(commentsObject)

				saveObject()

			}

			const setPriority = () => {

				object.currentPriority = Boolean(params.priority)
				let commentsObject = {
					comment: sprintf(botComments.priorityUpdate, email, params.priority),
					time: Date.now(),
					author: bot
				}
				object.conversation.push(commentsObject)

				writer.actions = {setPriority: !(writer.actions.setPriority)}
				saveObject()

			}

			/*
			routing starts here
			 */
			
			hasAccess(hasAccess => {
				if(hasAccess) {

					if(params.comments)
						pushComment()

					else if(params.priority !== undefined) {
						if((_.map(writer.actions, action => action.setPriority).indexOf(params.priority)) === -1)
							return sendError(sprintf(errors.accessRights, email, fellowEmail, params.priority), 4099, callback)
						else
							setPriority()
					}

					else
						return sendError(sprintf(errors.invalidInputs, email, fellowEmail, 'write'), 4099)

				} else {
					return sendError(sprintf(errors.accessRights, email, fellowEmail, 'write'), 4099)
				}
			})

		})

	},

	/**
	 * [create initial competencies objects ]
	 * @param  {[type]}   err      [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	createCompetencies: (err, params, callback) => {

		let email = params.email,
			competencies = params.competencies

		let accessRights = [
			{
				email: email,
				read: true,
				write: true,
				actions: []
			}
		]

		userModel.retrieveUserDetails(null, {email: email, query: ['managerEmail']}, (err, userDetails) => {

			if(err)
				return callback(err)

			if(userDetails.managerEmail) {
				accessRights.push({
					email: userDetails.managerEmail,
					read: true,
					write: true,
					actions: [{currentPriority: true}]
				})
			} else
				sendError('managerNotFound', 4004)

			const insert = (competency, cb) => {

				let query = {
						$and: [
							{email: email},
							{competencyName: competency}
						]
					},
					update = {
						email: email,
						competencyName: competency,
						accessRights: accessRights,
						conversation: [],
						currentPriority: false
					},
					options = {
						upsert: true
					}

				competencyModel.update(query, update, options, err => {
					if(err)
						return callback({err: err, code: 3001})
					cb()
				})

			}

			async.each(competencies, insert, err => {

				if(err)
					return sendError(err.err, err.code, callback)

				return callback(err)

			})

		})
			
	}

}

const bot = {
		email: 'path.bot@teachforindia.org',
		firstName: 'Path',
		lastName: 'Bot',
		displayName: 'Path Bot'
	}
	, botComments = {
		priorityUpdate: '%s changed priority to %s'
	}
	, errors = {
		accessRights: 'no accessRights for %s on %s to do %s',
		invalidInputs: 'invalid inputs'
	}
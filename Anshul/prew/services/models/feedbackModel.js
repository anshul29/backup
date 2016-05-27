'use strict'

const constants = require('../configs/constants.json')
	, redisDB = constants.redisDB.userModel

const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const errorHandler = require('../models/errorHandler')
	, sendError = errorHandler.sendError
	, debug = errorHandler.debug

const _ = require('lodash')
	, async = require('async')
	, sprintf = require('sprintf')

const redis = require('redis')
const redisClient = redis.createClient()
redisClient.on('error', function (err) {
	sendError(err, 3014)
})

redisClient.select(redisDB, function (err, redisResponse) {
	if(err || redisResponse !== 'OK')
		sendError(err, 3014)
})

const accessRightsSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	read: Boolean,
	write: Boolean,
	actions: []
})

const updateHistorySchema = new Schema({
	timestamp: Date,
	update: String,
	author: String
})

const feedbackQuestionSchema = new Schema({
	questionSetId: {
		type: String,
		index: {
			unique: true
		},
		required: true
	},
	questionSetType: String,
	title: String,
	createdDate: Date,
	questionList: [String],
	globalAnswerChoices: [],
	questionTypes: [],
	state: String,
	questions: {
		type: Schema.Types.Mixed
	},
	updateHistory: [updateHistorySchema],
	accessRights: [accessRightsSchema]

})

const feedbackQuestionModel = mongoose.model('feedbackQuestions', feedbackQuestionSchema)

const feedbackAnswerSchema = new Schema({
	email: String,
	questionSetId: String,
	answers: {
		type: Schema.Types.Mixed
	},
	state: String,
	accessRights: [accessRightsSchema],
	updateHistory: [updateHistorySchema]
}, {minimize: false})
feedbackAnswerSchema.index({email: 1, questionSetId: 1}, {unique: true, required: true})

const feedbackAnswerModel = mongoose.model('feedbackAnswers', feedbackAnswerSchema)

module.exports = {

	/**
	 * [description]
	 * @param  {[type]}   err      [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	createQuestionSet: (err, params, callback) => {

		let questions = params.questions

		let newQuestionSet = new feedbackQuestionModel({
			questionSetId: params.questionSetId,
			title: params.title,
			createdDate: Date.now(),
			questionList: [],
			globalAnswerChoices: params.globalAnswerChoices,
			questionTypes: [],
			state: params.state? params.state: 'draft',
			questions: {},
			accessRights: []
		})

		_.forEach(questions, (question, questionNumber) => {
			let key = question.key? question.key: `question${questionNumber + 1}`
			newQuestionSet.questions[key] = {
				text: question.text,
				type: question.type,
				answerChoices: question.answerChoices? question.answerChoices: undefined,
				order: question.order? question.order: (questionNumber + 1),
				association: question.association
			}
			newQuestionSet.questionList.push(key)
		})

		newQuestionSet.save(err => {
			callback(err)
		})

	},

	/**
	 * [description]
	 * @param  {[type]}   err      [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getFeedbackSet: (err, params, callback) => {

		let feedbackSet = {},
			jsonBuilder = {
				feedbackSet: feedbackSet
			}

		async.parallel({

			questions: (cb) => {

				feedbackQuestionModel.findOne({
					questionSetId: params.questionSetId
				}, (err, questionSet) => {

					if(err)
						return sendError(err, 3001, callback)
					if(!questionSet)
						return sendError(err, 3011, callback)

					jsonBuilder.questionList = questionSet.questionList

					_.forEach(questionSet.questions, (question, questionKey) => {

						if(!feedbackSet[questionKey])
							feedbackSet[questionKey] = {}

						let answerChoices

						if(question.type === 'multipleChoice')
							answerChoices = question.answerChoices? question.answerChoices: questionSet.globalAnswerChoices

						_.merge(feedbackSet[questionKey], {
							questionText: question.text,
							questionType: question.type,
							answerChoices: answerChoices
						})

					})

					cb(err)

				})

			},

			answers: (cb) => {

				let query = {
					questionSetId: params.questionSetId,
					email: params.authHeader.email
				}

				feedbackAnswerModel.findOne(query, (err, answerSet) => {

					let factory = () => {

						_.forEach(answerSet.answers, (answer, questionKey) => {

							if(!feedbackSet[questionKey])
								feedbackSet[questionKey] = {}

							feedbackSet[questionKey].answer = answer

						})

						cb(err)

					}

					if(!answerSet)
						module.exports.createAnswerSet(err, query, (err, newSet) => {
							answerSet = newSet
							factory()
						})

					else if(answerSet)
						factory()

				})

			}

		}, err => {

			callback(err, jsonBuilder)

		})

	},

	/**
	 * [description]
	 * @param  {[type]}   err      [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	updateAnswersSet: (err, params, callback) => {

		if(!params.answers)
			return sendError(errors.invalidInput, 4099, callback)

		let email = params.authHeader.email

		async.waterfall([

			(cb) => {

				feedbackQuestionModel.findOne({
					questionSetId: params.questionSetId
				}, (err, questionSet) => {

					if(err)
						return cb({err: err, code: 3001})

					if(!questionSet)
						return cb({err: 'not found', code: 3011})

					if(questionSet.state !== 'open')
						return cb({err: 'not open', code: 4099})

					return cb(err, questionSet)

				})

			},

			(questionSet, cb) => {

				feedbackAnswerModel.findOne({
					email: email,
					questionSetId: params.questionSetId
				}, (err, answerSet) => {

					if(err)
						return cb({err: err, code: 3001})

					if(!answerSet)
						return cb({err: 'not found', code: 3011})

					if(answerSet.state !== 'open')
						return cb({err: 'not open', code: 4099})

					let writer = _.findIndex(answerSet.accessRights, value => value.email === email)

					if(writer === -1)
						return sendError(sprintf(errors.accessRights, email, email, 'write'), 4099)

					let answers = {},
						maxAnswers = questionSet.questionList.length

					if(Array.isArray(params.answers)) {

						_.forEach(params.answers, (answer, index) => {

							let key = `question${index + 1}`,
								question = questionSet.questions[key]

							if(question.type === 'multipleChoice') {
								let answerChoices = question.answerChoices? question.answerChoices: questionSet.globalAnswerChoices
								if(answerChoices.indexOf(answer) === -1)
									return true
							}

							answers[key] = answer

							if(index > maxAnswers)
								return false

						})

					}

					else if(params.answers instanceof Object) {

						_.forEach(params.answers, (answer, questionKey) => {

							let question = questionSet.questions[questionKey]

							if(!question)
								return true

							if(question.type === 'multipleChoice') {
								let answerChoices = question.answerChoices? question.answerChoices: questionSet.globalAnswerChoices
								if(answerChoices.indexOf(answer) === -1)
									return true
							}

							answers[questionKey] = answer

						})

					}

					if(params.submit)
						answerSet.state = 'submitted'

					_.merge(answerSet.answers, answers)
					answerSet.markModified('answers')

					answerSet.updateHistory.push({
						timestamp: Date.now(),
						update: `${JSON.stringify(params.answerSet)}`,
						author: email
					})

					answerSet.save(err => {
						return cb(err? {err: err, code: 3001}: undefined)
					})

				})
			}

		], err => {

			if(err)
				return sendError(err.err, err.code, callback)

			return callback(err)

		})

	},

	/**
	 * [description]
	 * @param  {[type]}   err      [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	createAnswerSet: (err, params, callback) => {

		let accessRights = [{
			email: params.email,
			read: true,
			write: true
		}]

		let answerSet = new feedbackAnswerModel({
			email: params.email,
			questionSetId: params.questionSetId,
			answers: {},
			state: params.state? params.state: 'open',
			updateHistory: [{
				timestamp: Date.now(),
				update: 'Object Created'
			}],
			accessRights: accessRights
		})
		answerSet.save((err, newSet) => {
			callback(err, newSet)
		})

	}

}

const errors = {
	accessRights: 'no accessRights for %s on %s to do %s'
}
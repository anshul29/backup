'use strict'

const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const _ = require('lodash')
	, async = require('async')

const userModel = require('./userModel')

const sendError = require('./errorHandler').sendError

const memberSchema = new Schema({
		email: String,
		role: String,
		displayName: String,
		pictureURL: String
	})
	, circleSchema = new Schema({
		circleId: {
			type: String,
			index: {
				unique: true,
				sparse: true
			},
			trim: true,
			required: true
		},
		members: [memberSchema]
	})

const circleModel = mongoose.model('circle', circleSchema)

module.exports = {

	listMembers: (err, params, callback) => {

		let email = params.authHeader.email,
			context = params.context,
			circleId

		switch(context) {

		case('default'):
			circleId = email

		}

		circleModel.findOne({
			circleId: circleId
		}, (err, circle) => {

			if(err)
				return sendError(err, 3001, callback)

			if(circle) {
				let jsonBuilder = {
					members: _.map(circle.members, member => ({
						email: member.email,
						displayName: member.displayName
					}))
				}
				callback(err, jsonBuilder)
			}

			else if(!circle)
				return sendError(err, 3061, callback)

		})

	},

	createCircles: (err, params, callback) => {

		let circleId = params.circleId,
			members = params.members

		async.each(members, (member, cb) => {

			userModel.retrieveUserDetails(err, {email: member.email, query: 'publicDetails'}, (err, publicDetails) => {
				
				if(err)
					return callback({err: err, code: 3001})

				_.assign(member, publicDetails)
				cb()

			})

		}, err => {

			if(err)
				return sendError(err.err, err.code, callback)

			circleModel.update({
				circleId: circleId
			}, {
				members: members
			},
			{upsert: true},
			err => {

				if(err)
					return sendError(err, 3001, callback)

				return callback(err)

			})

		})

	}

}
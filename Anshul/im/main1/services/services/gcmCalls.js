'use strict'

var gcm = require('node-gcm')

var keyModel = require('../models/keyModel')

var gcmCalls = {}
module.exports = gcmCalls

gcmCalls.leaveNotification = function (err, params, callback) {

	keyModel.getDetails(err, {authHeader: params.authHeader, query: 'gcmServerAPIKey'}, function (err, gcmServerAPIKey) {

		var sender = new gcm.Sender(gcmServerAPIKey)
        var message = new gcm.Message(params.message)

		sender.send(message, {registrationIds: params.registrationIds}, function (err, result) {
		  	return callback(err, result)
		})

	})

}
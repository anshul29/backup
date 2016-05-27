'use strict'

var Fetch = require('whatwg-fetch')
const config = require('../../../server/configs/config')
const serverConfig = config.server

var rootUrl = (serverConfig && serverConfig.rootUrl) ? serverConfig.rootUrl:'http://localhost:8080'

module.exports = {

	accessToken: () => {
		return fetch(rootUrl + '/accessToken', {
			credentials: 'same-origin'
		})
		.then(response => response.json())
	},

	refreshAccessToken: () => {
		return fetch(rootUrl + '/refreshAccessToken', {
			credentials: 'same-origin'
		})
		.then(response => response.json())
	},

	logout: (params) => {
		return fetch(rootUrl + '/logout', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: params.token
			}),
			credentials: 'same-origin'
		})
		.then(response => response.json())
	}
}
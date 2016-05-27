'use strict'

var Fetch = require('whatwg-fetch')

var rootUrl = 'http://localhost:8080'

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
	}
}
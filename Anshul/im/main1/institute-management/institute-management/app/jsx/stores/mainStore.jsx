'use strict'

const server = require('../services/serverCalls')

const reducer = (state, action) => {

	if(action && action.type === 'check')
		if(!state)
			server.accessToken().then(json => {
				dispatcher(json)
			})

	if(action && action.type === 'done') {

		let response = action.json
		if(response.accessToken)
			state = response.accessToken
	}

	return state
}

const createStore = require('redux').createStore
	, mainStore = createStore(reducer)

const dispatcher = json => {
	mainStore.dispatch({type: 'done', json: json})
}

mainStore.refreshTokenHandler = () => {
	server.refreshAccessToken().then(json => {
		mainStore.dispatch({type: 'done', json: json})
	})
}

module.exports = mainStore
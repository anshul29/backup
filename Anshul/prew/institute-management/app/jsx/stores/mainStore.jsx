'use strict'

const server = require('../services/serverCalls')

const reducer = (state, action) => {

	if(action && action.type === 'check')
		// if(!state)
			server.accessToken().then(json => {
				dispatcher(json)
			})

	if(action && action.type === 'done') {

		let response = action.json
		if(response)
			state = response.accessToken
	}

	if(action && action.type === 'logout') {
		server.logout({token: state}).then(json => {
			dispatcher(json)
		})
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
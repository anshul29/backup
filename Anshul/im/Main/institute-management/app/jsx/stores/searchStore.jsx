'use strict'

const tfin = require('../tfin-client')

const mainStore = require('./mainStore')

const reducer = (state, action) => {

	if(action && action.type === 'search') {

		let params = {
			q: action.q,
			accessToken: mainStore.getState()
		}
		tfin.search(params, (err, response) => {
			if(response)
				dispatcher(response)
		})
	}

	if(action && action.type === 'done') {

		let response = action.json
		if(response.results && response.people)
			state = response.people
	}

	return state
}

const createStore = require('redux').createStore
	, searchStore = createStore(reducer)

const dispatcher = json => {
	searchStore.dispatch({type: 'done', json: json})
}

module.exports = searchStore
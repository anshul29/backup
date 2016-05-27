'use strict'

let mainStore = require('./mainStore')

const tfin = require('../tfin-client')

const reducer = (state, action) => {

  if(action && action.type === 'check') {
    if(!state)
    tfin.user.publicDetails({accessToken: mainStore.getState()}, (err, response) => {
      if(response)
      dispatcher(response)
    })
  }

    if(action && action.type === 'done') {
      let response = action.json
      if(response.publicDetails)
        state = response.publicDetails
    }

    return state

}

const dispatcher = json => {
	userStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, userStore = createStore(reducer)

module.exports = userStore

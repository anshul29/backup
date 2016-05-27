'use strict'

let mainStore = require('./mainStore')

const tfin = require('../tfin-client')

const reducer = (state, action) => {

  if(action && action.type === 'check') {
    if(!state)
    tfin.get('/feedbackSet?questionSetId=2016institute1Week1Survey',{accessToken: mainStore.getState()}, (err, response) => {
      if(response)
      dispatcher(response)
      console.log(err)
      //console.log(JSON.stringify(response))
    })
  }

    if(action && action.type === 'done') {
      let response = action.json
      if(response)
        state = response
    }

    return state

}

const dispatcher = json => {
  profileStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, profileStore = createStore(reducer)

module.exports = profileStore

'use strict'

let mainStore = require('./mainStore')

const tfin = require('../tfin-client')

const reducer = (state, action) => {

  if(action && action.type === 'post') {
    //if(!state)
    var body = {answers: action.answerDetails, submit: action.submit, questionSetId: action.questionSetId}
    tfin.post('/feedbackAnswers',{accessToken: mainStore.getState(), body:body}, (err, response) => {
      console.log(response)
      console.log('errr' + JSON.stringify(err))
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
  surveyStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, surveyStore = createStore(reducer)

module.exports = surveyStore

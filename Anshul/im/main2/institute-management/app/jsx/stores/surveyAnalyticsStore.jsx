'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');

const reducer = (state, action) => {

  if(action && action.type === 'check') {
     // if(!state){
      let queryString = '?type=feedbackDistribution';
      if(action.city)
        queryString = queryString + '&city='+action.city 
      if(action.questionSetId)
        queryString += '&questionSetId='+action.questionSetId;
      console.log('queryString='+queryString);
      tfin.get('/analytics/fellows'+queryString,{accessToken: mainStore.getState()}, (err, response) => {
        console.log(err)
        console.log(response)
        if(response)
          dispatcher(response)
      })
    // }
  }

  if(action && action.type === 'done') {
      let response = action.json
      if(response)
        state = response;
      else
        state = {};
  }
    
  return state;

}



const dispatcher = json => {
	surveyAnalyticsStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, surveyAnalyticsStore = createStore(reducer)

module.exports = surveyAnalyticsStore

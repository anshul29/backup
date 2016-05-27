'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');
// let userStore = require('./userStore');


const reducer = (state, action) => {

  

  if(action && action.type === 'check') {
     // if(!state){
      let queryString = '?type=competencyDistribution';
      if(action.city)
        queryString = queryString + '&city='+action.city;
      console.log('queryString='+queryString);
      tfin.get('/analytics/fellows'+queryString,{accessToken: mainStore.getState()}, (err, response) => {
        if(response)
          dispatcher(response)
      })
    // }
  }

  if(action && action.type === 'done') {
      let response = action.json
      if(response.distribution)
        state = response.distribution;
      else
        state = {};
  }
    
  return state;

}



const dispatcher = json => {
	compAnalyticsStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, compAnalyticsStore = createStore(reducer)

module.exports = compAnalyticsStore

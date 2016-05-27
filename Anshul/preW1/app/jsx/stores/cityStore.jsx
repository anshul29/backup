'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');

const reducer = (state, action) => {

 if(action && action.type === 'check') {
     if(!state)
      {
      tfin.get('/analytics/fellows?meta=true&type=competencyDistribution',{accessToken: mainStore.getState()}, (err, response) => {
        if(response){
          // console.log(JSON.stringify(response))
          // console.log(JSON.stringify(response.filters))
          dispatcher(response)
        }
      })
    }
  }

  if(action && action.type === 'done') {
      let response = action.json
      if(response.filters)
        state = response.filters.city;
      else
        state = {};
  }
    
  return state;

}

const dispatcher = json => {
	cityStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, cityStore = createStore(reducer)

module.exports = cityStore

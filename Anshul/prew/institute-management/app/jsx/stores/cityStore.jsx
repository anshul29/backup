'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');

const reducer = (state, action) => {

 if(action && action.type === 'check') {
     if(!state)
      {

      var filterType = action.filterType?action.filterType:'competencyDistribution'; // default  
      // console.log('filterType='+filterType)  
      var filterType = 'competencyDistribution'; // default  
      tfin.get('/analytics/fellows?meta=true&type='+filterType,{accessToken: mainStore.getState()}, (err, response) => {
        console.log(err)
        if(response){
          console.log(JSON.stringify(response))
          // console.log(JSON.stringify(response.filters))
          dispatcher(response)
        }
      })
    }
  }

  if(action && action.type === 'done') {
      let response = action.json
      if(response.filters)
        state = response.filters;
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

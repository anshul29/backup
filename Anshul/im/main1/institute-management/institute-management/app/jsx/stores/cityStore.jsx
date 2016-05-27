'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');
let userStore = require('./userStore');


const reducer = (state, action) => {

  // if(action && action.type === 'check') {
  //   if(!state)
  //     {
  //     // tfin.competencies({accessToken: mainStore.getState(),self:self}, (err, response) => {
  //       // if(response)
  //         // dispatcher(response)
  //     // })
  //   }
  // }

  // if(action && action.type === 'done') {
  //     let response = action.json
  //     if(response.cities)
  //       state = response.cities;
  //     else
  //       state = ;
  // }
    
  return this.getCities();

}

this.getCities = function(){
  return "['Mumbai','Pune']";
}

const dispatcher = json => {
	cityStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, cityStore = createStore(reducer)

module.exports = cityStore

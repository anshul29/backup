'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');
let userStore = require('./userStore');


const reducer = (state, action) => {

  if(action && action.type === 'get') {
    if(!state)
    {
      var self;
      var userDetails = userStore.getState();
      if(userDetails.role === 'staff'){

          tfin.get('/circles/members',{accessToken: mainStore.getState()}, (err, response) => {
            console.log(response);
            if(response){
              // console.log(response)
              dispatcher(response);
            }
        })
      }
    }
  }

    if(action && action.type === 'done') {
      let response = action.json
      if(response.members)
        state = response.members
    }

    return state

}

const dispatcher = json => {
	memberStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, memberStore = createStore(reducer)

module.exports = memberStore

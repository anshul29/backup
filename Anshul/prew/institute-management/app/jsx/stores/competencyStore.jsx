'use strict'
var React = require('react');
let mainStore = require('./mainStore');

const tfin = require('../tfin-client');
let userStore = require('./userStore');


const reducer = (state, action) => {

  if(action && action.type === 'check') {
    // if(!state) {
      var query;

      if(action.fellowEmail)
          query = {fellowEmail: action.fellowEmail}

      // console.log('query='+JSON.stringify(query))

      tfin.get('/competencies',{accessToken: mainStore.getState(),query:query}, (err, response) => {
        if(response){
          console.log(response)
          dispatcher(response)
        }

      })
    // }
  }

  if(action && action.type === 'post') {

    if(action.comment){
      let body = {
        comments: action.comment,
        fellowEmail: action.fellowEmail
      }
     
      tfin.post('/competencies',{accessToken: mainStore.getState(), body:body}, (err, response) =>
      {
        console.log('updating comment...'+JSON.stringify(err) + response);
        competencyDispatcher(action.fellowEmail);
      });
    }    
    
    if(action.description){

      let body = {
        competencyName: action.competencyName,
        description: action.description
      }

      tfin.post('/competencies',{accessToken: mainStore.getState(), body:body}, (err, response) =>
      {
        console.log('updating description...'+JSON.stringify(err) + response);
        competencyDispatcher()
      });
    }  
  }

  if(action && action.type === 'prioritize') {
    var body = {fellowEmail: action.fellowEmail, competencyName:action.competencyName, developmentState: action.developmentState}
    console.log('prioritize request='+JSON.stringify(body))
    tfin.post('/competencies',{accessToken: mainStore.getState(), body:body}, (err, response) =>
    {
      console.log('prioritize response='+JSON.stringify(err) + response)
      competencyDispatcher(action.fellowEmail);
    })
  }

  if(action && action.type === 'done') {
      let response = action.json
      if(response)
        state = response
  }

    return state

}

const competencyDispatcher = fellowEmail => {
	competencyStore.dispatch({type: 'check', fellowEmail: fellowEmail})
  console.log('inside competencyDispatcher')
}

const dispatcher = json => {
	competencyStore.dispatch({type: 'done', json: json})
}

const createStore = require('redux').createStore
	, competencyStore = createStore(reducer)

module.exports = competencyStore

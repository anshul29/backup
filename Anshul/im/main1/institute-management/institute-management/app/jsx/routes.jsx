'use strict'

const React = require('react'),
	ReactRouter = require('react-router')

const Router = ReactRouter.Router,
	Route = ReactRouter.Route
const browserHistory = ReactRouter.browserHistory

const Main = require('./components/main')
const Component2 = require('./components/main')
//const Component2 = require('./components/main')
//<Route path = '/comptencies' component = {competencies}></Route>
module.exports = (
	<Router history = {browserHistory}>
		<Route path = '/' component = {Main}>
			<Route path = '/path' component = {Component2}></Route>
		</Route>
	</Router>
)

'use strict'

const React = require('react')
	, ReactRouter = require('react-router')
	, Router = ReactRouter.Router
	, Route = ReactRouter.Route

const browserHistory = ReactRouter.browserHistory

const Main = require('./components/main')
const Competencies = require('./components/competencies/competencies')
const Surveys = require('./components/surveys/surveys')
const Library = require('./components/links/library')
const Resources = require('./components/resources/resources-fellow')
const Home = require('./components/home/home-fellow')

//const Calendar = require('')

module.exports = (
	<Router history = {browserHistory}>
		<Route path = '/' component = {Main}>
			<Route path = '/home' component = {Home}></Route>
			<Route path = '/competencies' component = {Competencies}></Route>
			<Route path = '/surveys' component = {Surveys}></Route>
			<Route path = '/library' component = {Library}></Route>
			<Route path = '/resources' component = {Resources}></Route>
		</Route>
	</Router>
)

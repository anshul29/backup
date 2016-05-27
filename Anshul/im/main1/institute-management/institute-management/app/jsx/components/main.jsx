'use strict'

let mainStore = require('../stores/mainStore')
let userStore = require('../stores/userStore')
let searchStore = require('../stores/searchStore')

var React = require('react');

var Sidebar_Fellow = require('./Fellow-Dashboard/sidebar_Fellow');
var Home_Fellow = require('./Fellow-Dashboard/home_fellow');
var Competency_Fellow = require('./Fellow-Dashboard/competency_fellow1');
var Header_Fellow = require('./Fellow-Dashboard/header_fellow');
var Test = require('./Fellow-Dashboard/test');



module.exports = React.createClass({
	getInitialState: function () {
		return {
			loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=712119106205-emhvi7pjqqrpq07ibqssqh2plqgf9qa6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fgoauthcallback&approval_prompt=force',
			accessToken: null,
			userDetails: {},
			people: []
		}
	},
	componentDidMount: function () {
		mainStore.dispatch({
			type: 'check'
		})
		mainStore.subscribe(function () {
			let accessToken = mainStore.getState()
			if(accessToken) {
				this.setState({
					accessToken: mainStore.getState()
				})
				userStore.dispatch({type: 'check'})
				userStore.subscribe(function () {
					let userDetails = userStore.getState()
					this.setState({
						userDetails: userDetails
					})
				}.bind(this))
			}

		}.bind(this))
	},
	render: function () {
		if(this.state.accessToken)
			return this.home()
		else
			return this.login()
	},
	handleInput: function (event) {
		let input = event.target.value
		if(input && input.length > 3)
			searchStore.dispatch({
				type: 'search',
				q: input
			})
		searchStore.subscribe(function () {
			let people = searchStore.getState()
			if(people)
				this.setState({people: people})
		}.bind(this))
	},
	content: function () {
		if(this.props.children)
			return this.props.children
		else
			return <div>
				<input type = 'text' onChange = {this.handleInput}/>
				<div>{this.renderResults()}</div>
			</div>
	},
	test: function () {
		if(this.props.children)
			return this.props.children
		else
			return <div>
				zThis is testz1
			</div>
	},

	home: function () {
		return <div>
		<header>
		<Test />
	  </header>
		<Sidebar_Fellow />
			<div>
				{this.content()}
			</div>
		</div>
	},
	login: function () {
		return <div>You need to <a href = {this.state.loginUri}><button className="btn btn-block btn-social btn-google">Sign In with Google</button></a></div>
	},
	renderResults: function () {
		return this.state.people.map( person => {
			return <div key = {person.displayName}>{person.displayName}</div>
		})
	}
})

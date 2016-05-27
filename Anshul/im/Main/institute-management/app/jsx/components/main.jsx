'use strict'

let mainStore = require('../stores/mainStore')
let searchStore = require('../stores/searchStore')

var React = require('react')

module.exports = React.createClass({
	getInitialState: function () {
		return {
			loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=712119106205-emhvi7pjqqrpq07ibqssqh2plqgf9qa6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fgoauthcallback&approval_prompt=force',
			accessToken: null,
			people: []
		}
	},
	componentDidMount: function () {
		mainStore.dispatch({
			type: 'check'
		})
		mainStore.subscribe(function () {
			let accessToken = mainStore.getState()
			if(accessToken)
				this.setState({
					accessToken: mainStore.getState()
				})

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
	menu: function () {
		return <ul>
			<li>Home</li>
			<li>About</li>
		</ul>
	},
	home: function () {
		return <div>
			<div>
				{this.menu()}
			</div>
			<div>
				{this.content()}
			</div>
		</div>
	},
	login: function () {
		return <div>You need to <a href = {this.state.loginUri}>login</a></div>
	},
	renderResults: function () {
		return this.state.people.map( person => {
			return <div key = {person.displayName}>{person.displayName}</div>
		})
	}
})
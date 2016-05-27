'use strict'

let mainStore = require('../stores/mainStore'),
	userStore = require('../stores/userStore'),
	searchStore = require('../stores/searchStore')

var React = require('react'),
	Login = require('./common/login'),
	Header = require('./common/header'),
	Sidebar = require('./common/sidebar')


const config = require('../../../server/configs/config')
const googleConfig = config.google

 module.exports = React.createClass({
	getInitialState: function () {
		return {
			loginUri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=712119106205-emhvi7pjqqrpq07ibqssqh2plqgf9qa6.apps.googleusercontent.com&redirect_uri='+googleConfig.redirectUri,
			accessToken: null,
			loggedIn: false,
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
			this.setState({
				accessToken: accessToken,
				loggedIn: true
			})

			userStore.dispatch({type: 'check'})
			userStore.subscribe(function () {
				let userDetails = userStore.getState()
				if(userDetails)
				{
					this.setState({
						userDetails: userDetails
					})
				}
			}.bind(this))

		}.bind(this))
	},

	render: function () {
		if(this.state.accessToken)
			return this.home()
		else if(!this.state.accessToken && !this.state.loggedIn)
			return <div></div>
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
				<Header />
				<div>
					<Sidebar pathname = {this.props.location? this.props.location.pathname: '/'}/>
					{this.content()}
				</div>
		</div>
	},

	login: function () {
		return <div>
			<Login />
		</div>
	},

	renderResults: function () {
		return this.state.people.map( person => {
			return <div key = {person.displayName}>{person.displayName}</div>
		})
	}
})

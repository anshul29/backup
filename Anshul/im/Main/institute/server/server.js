'use strict'

const config = require('./configs/config'),
	googleConfig = config.google,
	tfinConfig = config.tfin,
	sessionConfig = config.session

const path = require('path')
const abc = 'abc'
const constantConfig = require('./configs/constants.json')

const express = require('express'),
	app = express(),
	session = require('express-session')

const RedisStore = require('connect-redis')(session),
	redisOptions = {
		host: 'localhost',
		port: 6379,
		db: constantConfig.redisDB.sessions
	}

const tfinClient = require('../tfin-client'),
	tfin = new tfinClient({
		apiKey: tfinConfig.apiKey,
		clientId: tfinConfig.clientId
	})

const google = require('googleapis'),
	OAuth2 = google.auth.OAuth2

const clientId = googleConfig.clientId,
	clientSecret = googleConfig.clientSecret,
	rediretUri = googleConfig.rediretUri

let oauth2Client = new OAuth2(clientId, clientSecret, rediretUri)

tfin.key.scopes((err, response) => {

	if(response) {

		let scopes = response.scopes
		let url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes
		})

	}

})

app.use(session({
	secret: sessionConfig.sessionSecret,
	name: sessionConfig.sessionKey,
	saveUninitialized: false,
	resave: false,
	store: new RedisStore(redisOptions)
}))

app.get('/goauthcallback', (request, response) => {

	if(!request.query || !request.query.code)
		return response.send('error')

	tfin.user.sessions({authCode: request.query.code}, (err, tfinResponse) => {

		if(err)
			return response.send('error')

		request.session.accessToken = tfinResponse.tokens.teachPIAccessToken
		request.session.refreshToken = tfinResponse.tokens.teachPIRefreshToken
		response.redirect('/')

	})

})

app.get('/accessToken', (request, response) => {

	if(!request.session.accessToken || !request.session.refreshToken)
		response.send({accessToken: null})

	else
		response.send({accessToken: request.session.accessToken})

})

app.get('/refreshAccessToken', (request, response) => {

	if(request.session.refreshToken)
		tfin.user.tokens({refreshToken: request.session.refreshToken}, (err, tfinResponse) => {
			request.session.accessToken = tfinResponse.teachPIAccessToken
			response.send({accessToken: tfinResponse.teachPIAccessToken})
		})

	else
		response.send('You need to login again')

})

app.use(express.static(path.resolve(`${__dirname}/../app`)))
app.get('*', (request, response) => {
	response.sendFile(path.resolve(`${__dirname}/../app/index.html`))
})

app.listen(constantConfig.port, () => {
	console.info(`Listening On Port ${constantConfig.port}`)
})

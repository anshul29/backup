'use strict'

const config = require('./configs/config'),
	tfinConfig = config.tfin,
	sessionConfig = config.session

const path = require('path')

const constantConfig = require('./configs/constants.json')

const express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, session = require('express-session')

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

app.use(session({
	secret: sessionConfig.sessionSecret,
	name: sessionConfig.sessionKey,
	saveUninitialized: false,
	resave: false,
	store: new RedisStore(redisOptions)
}))
app.use(bodyParser.json())

app.get('/goauthcallback', (request, response) => {

	if(!request.query || !request.query.code)
		return response.send('error')

	tfin.user.sessions({authCode: request.query.code}, (err, tfinResponse) => {

		if(err) {
			return response.send(err.errorMessage)
		} else if(tfinResponse) {

			request.session.accessToken = tfinResponse.tokens.teachPIAccessToken
			request.session.refreshToken = tfinResponse.tokens.teachPIRefreshToken
			response.redirect('/')

		}

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

			if(err)
				response.send({accessToken: null})

			else if(tfinResponse) {
				request.session.accessToken = tfinResponse.teachPIAccessToken
				response.send({accessToken: tfinResponse.teachPIAccessToken})
			}

		})

	else
		response.send({accessToken: null})

})

app.post('/logout', (request, response) => {

	if(request.body.token === request.session.accessToken) {
		request.session.destroy(() => {
			response.send({accessToken: null})
		})
	}

	else
		response.send({accessToken: request.session.accessToken})

})

app.use(express.static(path.resolve(`${__dirname}/../app`)))
app.get('*', (request, response) => {
	response.sendFile(path.resolve(`${__dirname}/../app/index.html`))
})

app.listen(constantConfig.port, () => {
	console.info(`Listening On Port ${constantConfig.port}`)
})

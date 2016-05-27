'use strict'

var globalObject = {}
module.exports = globalObject

/*
Set Up Logging
 */

var bunyan = require('bunyan')
var log = globalObject.log = bunyan.createLogger({
	name: 'tfin'
	, streams: [{
		level: 'trace'
		, path: `${__dirname}/logs/trace.log`
	}
	, {
		level: 'debug',
		stream: process.stdout
	}
	, {
		level: 'info',
		path: `${__dirname}/logs/info.log`
	}
	, {
		level: 'warn',
		path: `${__dirname}/logs/warn.log`
	}
	, {
		level: 'error',
		path: `${__dirname}/logs/error.log`
	}
	, {
		level: 'fatal',
		path: `${__dirname}/logs/fatal.log`
	}]
})
globalObject.routeLog = bunyan.createLogger({
	name: 'tfin'
	, streams: [{
		level: 'trace',
		path: `${__dirname}/logs/access.log`
	}]
})

/*
Prepare Express App
 */

var express = require('express')
var bodyParser = require('body-parser')
var favicon = require('serve-favicon')

var app = express()

app.disable('x-powered-by')
app.use(bodyParser.json())

let config = require('./configs/config')

/*
Connect To Database - mongo
 */

var mongoose = require('mongoose')

let dbDetails = {}
dbDetails = config.db

dbDetails.URI = `${dbDetails.protocol}:\/\/${dbDetails.username}:${dbDetails.password}@${dbDetails.host}:${dbDetails.port}/${dbDetails.database}`

mongoose.connect(dbDetails.URI, err => {
	if(err)
		log.fatal(err)
})	

var db = mongoose.connection
db.on('error', err => {
	log.fatal(err)
})
db.once('open', () => {
	log.info(`Connected to Database ${dbDetails.database} on ${dbDetails.host}:${dbDetails.port}`)
})

if(process.env.DEBUG)
	mongoose.set('debug', true)

/*
Verify Redis Connection
 */

var redis = require('redis')
var redisClient = redis.createClient()
redisClient.on('connect', () => {
	log.info('Connected to Redis')
})
redisClient.on('error', err => {
	log.fatal(err)
})

/*
Verify Elasticsearch connection
 */

var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
})
client.ping({}, (err, response) => {
	if(err)
		log.fatal(err)
	else if(response)
		log.info('Connected to Elasticsearch')
})

/*
API Routes
 */

var routes = require('./routes/index.js')
app.use('/api/v0/', routes)

/*
App Routes
 */

app.use(favicon(`${__dirname}/app/images/favicon.ico`))
app.use(express.static(`${__dirname}/app`))

/*
Handle Middleware Errors
 */

app.use((err, req, res, next) => {
	log.error(err)
	let finalJson = {errors: 'yes'}
	res.status(500).send(finalJson)
})

/*
Listen For Connections
 */

let port = process.env.PORT || config.tfinPort
app.set('port', port)

app.listen(app.get('port'), () => {
	log.info(`Listening for Connections on Port ${port}`)
})
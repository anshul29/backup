'use strict'

const salt = require('../configs/config').elasticSearch.salt

const userModel = require('../models/userModel')

const crypto = require('crypto')
	, async = require('async')
	, moment = require('moment-timezone')
	, _ = require('lodash')

var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
})

var sendError = require('../models/errorHandler').sendError

var ensureIndices = () => {

	client.indices.exists({index: 'candidates'}, (err, response) => {
		if(!response) {
			client.indices.create({index: 'candidates'}, (err, response) => {
				if(response.acknowledged !== true)
					sendError(err, 7009)
			})
		}
	})

	client.indices.exists({index: 'timeseries'}, (err, response) => {
		if(!response) {
			client.indices.create({index: 'timeseries'}, (err, response) => {
				if(response.acknowledged !== true)
					sendError(err, 7009)
			})
		}
	})

	client.indices.exists({index: 'users'}, (err, response) => {
		if(!response) {
			client.indices.create({
				index: 'users',
				body: {
					settings: {
						analysis: {
							filter: {
								autoCompleteFilter: {
									type: 'edge_ngram',
									min_gram: 3,
									max_gram: 20						
								},
								englishFilter: {
									type: 'stemmer',
									name: 'english'
								},
								citySynonymFilter: {
									type: 'synonym',
									synonyms_path: 'analysis/synonym.txt'
								}
							},
							analyzer: {
								englishAutocomplete: {
									type: 'custom',
									tokenizer: 'standard',
									filter: [
										'lowercase',
										'englishFilter',
										'autoCompleteFilter'
									]
								},
								citySynonymAutocomplete: {
									type: 'custom',
									tokenizer: 'standard',
									filter: [
										'lowercase',
										'citySynonymFilter',
										'autoCompleteFilter'
									]
								},
								autocomplete: {
									type: 'custom',
									tokenizer: 'standard',
									filter: [
										'lowercase',
										'autoCompleteFilter'
									]
								}
							}
						}				
					},
					mappings: {
						movement: {
							dynamic_templates: [
								{
									englishAutocomplete: {
										match: 'role',
										mapping: {
											type: 'string',
											analyzer: 'englishAutocomplete'
										}
									}
								},
								{
									citySynonymAutocomplete: {
										match: 'location',
										mapping: {
											type: 'string',
											analyzer: 'citySynonymAutocomplete'
										}
									}
								},
								{
									autocomplete: {
										match_mapping_type: 'string',
										mapping: {
											type: 'string',
											analyzer: 'autocomplete'
										}

									}
								}
							]
						}
					}
				}
			}, (err, response) => {
				if(response.acknowledged !== true)
					sendError(err, 7009)
			})
		}
	})

}

client.ping({}, err => {
	if(!err)
		ensureIndices()
})

var elasticSearchInterface = {}
module.exports = elasticSearchInterface

elasticSearchInterface.indexCandidate = (err, params, callback) => {

	var id = crypto.createHmac('md5', salt).update(params.params.candidateId).digest('hex')
		, body = params.body
		, timestamp = body.lastUpdateTime = moment(body.lastUpdateTime).utc().format()

	client.index({
		index: 'candidates',
		type: 'fellowship',
		id: id,
		body: body
	}, (err, response) => {

		if(err)
			return sendError(err, 7001, callback)

		if(response._shards.successful === 1){

			setTimeout(() => {

				aggregator((err, results) => {

					if(err)
						return sendError(err, 7001, callback)

					results.timestamp = timestamp

					indexTimeSeries(err, {counters: results}, err => {

						if(err)
							return sendError(err, 7001, callback)

						return callback(err)
					})

				})

			}, 1000)				

		}

		else
			return sendError('not successful', 7002, callback)

	})

}

var indexTimeSeries = (err, params, callback) => {

	var body = params.counters

	client.index({
		index: 'timeseries'
		, type: 'appFormApp'
		, body: body
	}, (err, response) => {

		if(err)
			return sendError(err, 7001, callback)
		if(response._shards.successful === 1)
			return callback(err)
		else
			return sendError('not successful', 7002, callback)

	})

}

var aggregator = callback => {

	var getCount = (dslQuery, callback) => {

		client.search({
			index: 'candidates'
			, search_type: 'count'
			, body: {
				query: dslQuery
				, aggs: {
					count: {
						value_count: {
							field: 'cohortYear'
						}
					}
				}
			}
		}, (err, response) => {
			return callback(err, response.aggregations.count.value)
		})
	}

	async.parallel({
		registeredCount: callback => {
			getCount({match: {contactMasterStatus: 'Registered'}}, callback)
		},
		basicCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.basic': 'Completed'}
						},
						{
							match: {'formSections.basic': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		workCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.work': 'Completed'}
						},
						{
							match: {'formSections.work': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		educationCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.education': 'Completed'}
						},
						{
							match: {'formSections.education': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		interestCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.interest': 'Completed'}
						},
						{
							match: {'formSections.interest': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		essaysCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.essays': 'Completed'}
						},
						{
							match: {'formSections.essays': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		submissionCount: callback => {
			getCount({
				bool: {
					should: [
						{
							match: {'formSections.submission': 'Completed'}
						},
						{
							match: {'formSections.submission': 'Submitted'}
						}
					]
				}
			}, callback)
		},
		applicationCompleteCount: callback => {
			getCount({match: {contactMasterStatus: 'Application Complete'}}, callback)
		}

	}, callback)

}

elasticSearchInterface.buildMovement = (callback) => {

	userModel.retrieveAllUsers(null, (err, result) => {

		let body = [],
			index = 0

		_.forEach(result, user => {

			user = user.toJSON()

			let indexedUser = {
				email: user.email
			}
			_.merge(indexedUser, user.publicDetails)

			let id = crypto.createHmac('md5', salt).update(indexedUser.email).digest('hex')

			body[index++] = {
				index: {
					_index: 'users',
					_type: 'movement',
					_id: id
				}
			}
			body[index++] = indexedUser

		})

		client.bulk({
			body: body
		}, err => {

			if(err)
				return sendError(err, 7001, callback)
			callback(err)

		})

	})

}

elasticSearchInterface.search = (err, params, callback) => {

	if(!_.isString(params.query.context))
		return sendError(err, 7099, callback)

	switch(params.query.context){

	default:

		userModel.verifyUserToken(err, params.authHeader, err => {

			if(err)
				return callback(err)

			let query = params.query.q

			client.search({
				index: 'users',
				body: {
					query: {
						multi_match: {
							query: query,
							type: 'most_fields',
							fields: ['firstName', 'lastName', 'location', 'role'],
							analyzer: 'english',
							fuzziness: 'AUTO'
						}
					}
				}
			}, (err, response) => {

				if(err)
					return sendError(err, 7001, callback)

				let peopleResults = []

				if(response.hits && response.hits.hits)
					peopleResults = _.map(response.hits.hits, result => ({
						link: result._source.email,
						pictureURL: result._source.pictureURL,
						title: result._source.displayName,
						info1: _.capitalize(result._source.location),
						info2: _.capitalize(result._source.role)
					}))

				let jsonBuilder = {
					resultTypes: ['people'],
					people: peopleResults
				}

				callback(err, jsonBuilder)
			})

		})

	}

}
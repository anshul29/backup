const mainStore = require('./stores/mainStore')

const tfinConfig = require('../configs/config').tfin

const tfinClient = require('../../tfin-client')
	, tfin = new tfinClient({
		apiKey: tfinConfig.apiKey,
		clientId: tfinConfig.clientId,
		refreshTokenHandler: mainStore.refreshTokenHandler
	})

module.exports = tfin
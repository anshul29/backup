'use strict'

var fs = require('fs')
var mkdirp = require('mkdirp')
var async  = require('async')
var path = require('path')
var chalk = require('chalk')

var copyFile = function (source, target, callback) {

	var callbackCalled = false

	var readStream = fs.createReadStream(source)
	readStream.on('error', done)

	var writeStream = fs.createWriteStream(target)
	writeStream.on('error', done)
	writeStream.on('close', function () {
		done()
	})

	readStream.pipe(writeStream)

	function done (err) {
		if(!callbackCalled) {
			callback(err)
			callbackCalled = true
		}
	}
}

async.parallel({

	f0: function (callback) {

		console.log(chalk.blue('Running post install script . . .\n'))

		callback()

	}

	, f1: function (callback) {

		let source = path.join(__dirname, 'v3.js')
			, target = path.join(__dirname, '../node_modules/googleapis/apis/oauth2/v3.js')

		console.log(chalk.blue(' . . . Copying %s . . .\n'), source)

		copyFile(source, target, function (err) {

			if(err)
				callback(err)
			else
				console.log(chalk.green('\n Copied %s to %s\n'), source, target)

			callback()

		})

	}

	, f2: function (callback) {

		let source = path.join(__dirname, 'variablesSample/ecosystem.json')
			, target = path.join(__dirname, '../ecosystem.json')

		console.log(chalk.blue(' . . . Copying %s . . .\n'), source)

		fs.access(target, function (err) {

			if(err) {

				copyFile(source, target, function (err) {

					if(err)
						callback(err)
					else
						console.log(chalk.green('\n Copied %s to %s\n'), source, target)

					callback()

				})
			}

			else {

				console.log(chalk.green('\n %s already exists\n'), target)
				callback()

			}
		})

	}

	, f3: function (callback) {

		console.log(chalk.blue(' . . . Making sure logs directory is available . . .\n'))

		let logDirectory = path.join(__dirname, '../logs')

		mkdirp(logDirectory, function (err) {

			if(err)
				callback(err)
			else
				console.log(chalk.green('\n Logs Directory Available\n'))

			callback()

		})

	}
}, function (err) {

	if(err)
		console.log(chalk.red(err))

	if(!err) {

		let target = path.join(__dirname, '../configs/variables/variables.json')

		console.log(chalk.blue('\n Checking if %s exists\n'), target)

		fs.access(target, function (err) {

			if (err) {
				console.log(chalk.blue('\n Could not find %s\n'), target)
				require('./setup')
			}

			else
				console.log(chalk.green('\n %s already exists. Do "npm run setup" to configure\n'), target)

		})
		
	}

})
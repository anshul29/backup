'use strict'

var gulp = require('gulp')
var source = require('vinyl-source-stream')
var browserify = require('browserify')
var watchify = require('watchify')
var reactify = require('reactify')
var notifier = require('node-notifier')
var server = require('gulp-server-livereload')
var concat = require('gulp-concat')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var streamify = require('gulp-streamify')
var babelify = require('babelify')

var notify = (err) => {

	console.log('err='+err)
	var message = 'In: '
	var title = 'Error: '

	if(err.description)
		title += err.description
	else if (err.message)
		title += err.message

	if(err.filename) {
		var file = err.filename.split('/')
		message += file[file.length-1]
	}

	if(err.lineNumber)
		message += '\nOn Line: ' + err.lineNumber

	notifier.notify({title: title, message: message})

}

var bundler = watchify(browserify({
	entries: ['./app/jsx/app.jsx']
	, transform: [reactify]
	, extensions: ['.jsx']
	, debug: true
	, cache: {}
	, packageCache: {}
	, fullPaths: true
}))

function bundleForServer() {
	return bundler
	.transform(babelify, {
            presets: ['es2015'],
            compact: false,
            global: true})
	.bundle()
	.on('error', notify)
	.pipe(source('app.js'))
	.pipe(streamify(uglify()).on('error', notify))
	.pipe(gulp.dest('./app'));

}

gulp.task('build-server', () => {
	bundleForServer()
})

function bundle() {
	return bundler
	.bundle()
	.on('error', notify)
	.pipe(source('app.js'))
	.pipe(gulp.dest('./app/'))
}
bundler.on('update', bundle)

gulp.task('build', () => {
	bundle()
})

gulp.task('serve', () => {

	gulp.src('app')
	.pipe(server({
		livereload: {
			enable: true,
			filter: (filePath, callback) => {
				if(/app.js/.test(filePath))
					callback(true)
				else if(/style.css/.test(filePath))
					callback(true)
			}
		},
		host: 'localhost',
		port: 8080,
		open: true
	}))

})

gulp.task('sass', () => {

	gulp.src('./app/sass/app.scss')
	.pipe(sass({
		includePaths: ['./app/bower_components/foundation-sites/scss']
	}).on('error', sass.logError))
	.pipe(concat('style.css'))
	.pipe(gulp.dest('./app'))

})

gulp.task('default', ['build', 'serve', 'sass', 'watch'])

gulp.task('server', ['build-server', 'sass'])

gulp.task('watch', () => {
	gulp.watch('./app/sass/**/*.scss', ['sass'])
})

'use strict'
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var circleSchema = new Schema({

})

var circleModel = mongoose.model('circle', circleSchema)

var circleModelInterface = {}
module.exports = circleModelInterface
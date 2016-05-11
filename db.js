var mongo = require('mongodb')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/sweetch')

module.exports = mongoose.connection

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

var db = require('./config/db.js');

mongoose.connect(db.url);

require('./app/routes')(app);

module.exports = app;
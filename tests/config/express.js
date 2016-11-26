var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mockAuth = require('./mockAuth');
var group = require('../../app/routes/group');
var groups = require('../../app/routes/groups');
var user = require('../../app/routes/user');

var db = require('../../config/db');

mongoose.connect(db.server);

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/json' }));

app.use(bodyParser.urlencoded({ extended: true }));

require('../../app/routes')(app);

app.use('/user', mockAuth, user);
app.use('/group', mockAuth, group);
app.use('/groups', mockAuth, groups);

module.exports = app;
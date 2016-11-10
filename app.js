var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var auth = require('./app/middlewares/auth');

var group = require('./app/routes/group');
var groups = require('./app/routes/groups');
var user = require('./app/routes/user');

mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/json' }));

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app);

app.use('/user', auth, user);
app.use('/group', auth, group);
app.use('/groups', auth, groups);

module.exports = app;
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var auth = require('./app/middlewares/auth');

var group = require('./app/routes/group');
var user = require('./app/routes/user');

var db = require('./config/db');

mongoose.connect(db.url);

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/json' }));

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app);

app.use('/user', auth, user);
app.use('/group', auth, group);
app.use('/403', function(req, res) {
    res.send('403 FORBIDDEN');
});

module.exports = app;
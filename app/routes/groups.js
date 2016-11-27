/*
groups.js
Router
Reference number: 2.5
This router calls the proper controller function for each API endpoint in /groups
*/
var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');

router.get('/', function(req, res) {
    return userController.getGroups(req, res);
});

module.exports = router;

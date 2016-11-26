var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');

router.get('/', function(req, res) {
    return userController.getGroups(req, res);
});

module.exports = router;
var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');

// Test api
router.get('/', function(req, res) {
    return userController.getAll(req, res);
});

router.post('/login', function(req, res) {
    return userController.login(req, res);
});

module.exports = router;
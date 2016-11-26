var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Test api
router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) res.status(500).json({ status: 500, error: err.toString()});
        res.status(200).json(users);
    });
});

router.post('/login', function(req, res) {
    var user = {
        name : req.user.name,
        email : req.user.email,
        googleId : req.user.googleId,
    };

    User.findOneAndUpdate({googleId: req.user.googleId}, user,
        {upsert: true, new: true, setDefaultsOnInsert: true}, function(err) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        return res.status(200).json({});
    });
});

module.exports = router;
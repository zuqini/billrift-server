var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Test api
router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        users.forEach(function(user) {
            console.log(user);
        });
        res.send('test');
    });
});

router.post('/login', function(req, res) {
    var user = {
        name : req.query.name,
        email : req.query.email,
        googleId : req.query.googleId,
    };

    User.findOneAndUpdate({googleId: req.query.googleId}, user,
        {upsert: true, new: true, setDefaultsOnInsert: true}, function(err){
        if (err) return res.send(500, { error: err });
        return res.json(user);
    });
});

module.exports = router;
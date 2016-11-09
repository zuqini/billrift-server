var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Group = require('../models/group');

// Test api
router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) res.status(500).json({ status: 500, error: err.toString()});
        res.json(users);
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
        console.log(user);
        return res.json({});
    });
});

router.post('/group', function(req, res) {
    var group = {
        name: req.query.name,
        userIds : [ req.user.googleId ]
    };

    Group.create(group, function(err, group) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        console.log(group);

        User.findOneAndUpdate({googleId: req.user.googleId}, {$push: { groupIds : group.id }}, {upsert: true}, function(err) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            res.json({});
        });
    });
});

module.exports = router;
var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Group = require('../models/group');
var User = require('../models/user');

router.get('/', function(req, res) {
    User.findOne({ googleId: req.user.googleId }, function(err, user) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        var query = {
            id: { $in: user.groupIds }
        };
        Group.find(query, function(err, groups) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            res.status(200).json(groups);
        });
    });
});

module.exports = router;
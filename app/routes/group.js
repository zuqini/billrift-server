var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Group = require('../models/group');
var User = require('../models/user');

router.get('/', function(req, res) {
    var googleId = req.user.googleId;
    User.findOne({ googleId: googleId }, function(err, user) {
        if (!err) {
            var query = {
                id: { $in: user.groupIds }
            };
            Group.find(query, function(err, groups) {
                if (!err) {
                    res.json(groups);
                }
            });
        }
    });
});

module.exports = router;
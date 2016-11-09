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
            res.json(groups);
        });
    });
});

// router.get('/:id/transactions', function (req, res) {
//     var groupId = req.params.id;
//     var query = {
//         groupId: groupId
//     }
//     Transaction.find(query, function(err, transactions) {
//         if (!err) {
//             res.json(transactions);
//         } else {
//             res.status(500).send({error: err});
//         }
//     });
// });

router.get('/:id/users', function (req, res) {
    var groupId = req.params.id;
    Group.findOne({id: groupId}, function(err, group) {
        if (err) return res.status(500).json({status: 500, error: err.toString()});
        var userIds = group.userIds;
        var query = {
            googleId: {$in: userIds}
        };
        User.find(query, function (err, users) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            res.json(users);
        });
    });
});

router.post('/:id/user', function (req, res) {
    var groupId = req.params.id;
    var email = req.query.email;
    User.findOne({email: email}, function(err, user) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        if (!user) return res.status(404).json({ status: 404, error: 'User not found.'});
        var googleId = user.googleId;
        Group.findOne({id: groupId}, function(err, group) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            if (!group) return res.status(404).json({ status: 404, error: 'Group not found.'});
            if (_.indexOf(group.userIds, googleId) !== -1) return res.status(500).json({ status: 500, error: "User is already in group."});

            Group.update({id: groupId}, {$push: {userIds: googleId}}, function(err, group) {
                if (err) return res.status(500).json({ status: 500, error: err.toString()});
                res.json({});
            });
        });
    });
});

// router.post('/:id/transaction', function(req, res) {
//     var groupId = req.params.id;
//     var userFromId = req.body.userFromId;
//     var userToId = req.body.userToId;
//     var amount = req.body.amount;
//     Transaction.insert({userFromId, userToId, amount, groupId}, {}, function(err, transaction) {
//         if (!err) {
//             res.status(200).send({transaction});
//         } else {
//             res.status(500).send({error: err});
//         }
//     });
// });

module.exports = router;

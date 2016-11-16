var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Group = require('../models/group');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var Helper = require('../helper');

router.post('/', function(req, res) {
    var name = req.body.name;
    if (!name) {
        if (err) return res.status(400).json({ status: 400, error: "Missing group name."});
    }

    var group = {
        name: req.body.name,
        userIds : [ req.user.googleId ]
    };

    Group.create(group, function(err, group) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});

        User.findOneAndUpdate({googleId: req.user.googleId}, {$push: { groupIds : group.id }}, {upsert: true}, function(err) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            res.status(200).json({});
        });
    });
});

/*
 *  Get the list of users for a group identified by id
 */
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
            res.status(200).json(users);
        });
    });
});

router.post('/:id/user', function (req, res) {
    var groupId = req.params.id;
    var email = req.body.email;
    User.findOneAndUpdate({email: email}, {$push: { groupIds : parseInt(groupId, 10) }}, {new: true}, function(err, user) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        if (!user) return res.status(404).json({ status: 404, error: 'User not found.'});
        var googleId = user.googleId;
        Group.findOne({id: groupId}, function(err, group) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            if (!group) return res.status(404).json({ status: 404, error: 'Group not found.'});
            if (_.indexOf(group.userIds, googleId) !== -1) return res.status(500).json({ status: 500, error: "User is already in group."});

            Group.update({id: groupId}, {$push: {userIds: googleId}}, function(err, group) {
                if (err) return res.status(500).json({ status: 500, error: err.toString()});
                res.status(200).json({});
            });
        });
    });
});

/*
 *  Get the list of transactions for a group identified by id
 */
router.get('/:id/transactions', function (req, res) {
    var groupId = req.params.id;

    if (!groupId) {
        return res.status(400).json({ status: 400, error: "Bad parameters."});
    }

    var query = {
        groupId: groupId
    };
    Transaction.find(query, function(err, transactions) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        res.json(transactions);
    });
});

/*
 *  Add a new transaction to the group
 */
router.post('/:id/transaction', function(req, res) {
    var groupId = req.params.id;
    var userFromId = req.body.userFromId;
    var userToId = req.body.userToId;
    var amount = req.body.amount;
    var title = req.body.title;

    if (!groupId || !userFromId || !userToId || !amount) {
        return res.status(400).json({ status: 400, error: "Bad parameters."});
    }

    if (userFromId.localeCompare(userToId) === 0) {
        return res.status(400).json({ status: 400, error: "Cannot have a transaction with the same user."});
    }

    Group.findOne({id: groupId}, function(err, group) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        if (!group) return res.status(404).json({ status: 404, error: "Group not found."});
        if (group.userIds.indexOf(userFromId) === -1 || group.userIds.indexOf(userToId) === -1) {
            return res.status(404).json({ status: 404, error: "User not found."});
        }
        Transaction.create({
            userFromId: userFromId,
            userToId: userToId,
            amount: amount,
            groupId: groupId,
            title: title
        }, function(err, transaction) {
            if (!err) {
                res.status(200).json({transaction: transaction});
            } else {
                res.status(500).json({error: err});
            }
        });
    });
});

router.get('/:id/balances', function (req, res) {
    var groupId = req.params.id;

    if (!groupId) {
        return res.status(400).json({ status: 400, error: "Bad parameters."});
    }

    var query = {
        groupId: groupId
    };
    Transaction.find(query, function(err, transactions) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
	if(!transactions.length) return res.status(200).json([]);

        var result = Helper.buildMatrix(transactions);

        console.log("built matrix", result);

        var matrix = result.matrix;
        var indices = result.indices;

        Helper.directMatrix(matrix);
        Helper.optimizeMatrix(matrix);

        console.log("optimized and directed matrix", matrix);

        var balances = [];
        var reverseIndices = _.invert(indices);
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== 0) {
                    var fromId = reverseIndices[i];
                    var toId = reverseIndices[j];
                    var amount = matrix[i][j];

                    balances.push({
                            "from": fromId,
                            "to": toId,
                            "amount": amount,
                            "groupId": groupId
                        });
                }
            }
        }

        res.json(balances);
    });
});

module.exports = router;

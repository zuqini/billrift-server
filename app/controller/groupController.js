/*
groupController.js
Controller
Reference number: 2.8
This file updates the database for the group-specific APIs,
and also computes the balances
*/
var _ = require('lodash');

var Group = require('../models/group');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var BOM = require('../balanceOptimizationModule');

module.exports = {
    /*
     *  Create a new group for a user
     */
    createGroup(req, res) {
        var name = req.body.name;
        if (!name) {
            return res.status(400).json({ status: 400, error: "Missing group name."});
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
    },

    /*
     *  Optimize transactions and return balances for a group
     */
	getBalances(req, res) {
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

            var result = BOM.buildMatrix(transactions);

            // console.log("built matrix", result);

            var matrix = result.matrix;
            var indices = result.indices;

            BOM.directMatrix(matrix);
            BOM.optimizeMatrix(matrix);

            // console.log("optimized and directed matrix", matrix);

            var balances = [];
            var reverseIndices = _.invert(indices);
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] !== 0) {
                        var fromId = reverseIndices[j];
                        var toId = reverseIndices[i];
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
    },

    /*
     *  Get the list of transactions for a group identified by id
     */
    getTransactions(req, res) {
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
    },

    /*
     *  Get the list of users for a group identified by id
     */
    getUsers(req, res) {
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
    },

    /*
     *  Add a new user to the group
     */
    addUserToGroup(req, res) {
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
    },

    /*
     *  Add a new transaction to the group
     */
    addTransactionToGroup(req, res) {
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
    }
};

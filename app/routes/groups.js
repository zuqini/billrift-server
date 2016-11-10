var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Group = require('../models/group');
var User = require('../models/user');
var Transaction = require('../models/transaction');

router.get('/', function(req, res) {
    User.findOne({ googleId: req.user.googleId }, function(err, user) {
        if (err) return res.status(500).json({ status: 500, error: err.toString()});
        var query = {
            id: { $in: user.groupIds }
        };
        Group.find(query, function(err, groups) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
            var groupIds = _.map(groups, 'id');
            Transaction.find({groupId: {$in: groupIds}}, function(err, transactions){
                if (err) return res.status(500).json({ status: 500, error: err.toString()});
                var transactionsByGroup = _.groupBy(transactions, function(transaction) {
                    return transaction.groupId;
                });
                var groupsWithBalances = _.map(groups, function(group) {
                    var balance = 0;
                    _.forEach(transactionsByGroup[group.id], function(transaction) {
                        if (req.user.googleId.localeCompare(transaction.userFromId) === 0) {
                            balance += transaction.amount;
                        } else if (req.user.googleId.localeCompare(transaction.userToId) === 0) {
                            balance -= transaction.amount;
                        }
                    });
                    return {
                        balance: balance,
                        id: group.id,
                        name: group.name,
                        userIds: group.userIds
                    } ;
                });

                res.status(200).json(groupsWithBalances);
            });
        });
    });
});

module.exports = router;
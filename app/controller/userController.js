var _ = require('lodash');

var Group = require('../models/group');
var User = require('../models/user');
var Transaction = require('../models/transaction');

module.exports = {
	login(req, res) {
		var user = {
	        name : req.user.name,
	        email : req.user.email,
	        googleId : req.user.googleId,
	    };
		User.findOneAndUpdate({googleId: user.googleId}, user,
			{upsert: true, new: true, setDefaultsOnInsert: true}, function(err) {
			if (err) return res.status(500).json({ status: 500, error: err.toString()});
			return res.status(200).json({});
		});
	},
	getAll(req, res) {
		User.find({}, function(err, users) {
			if (err) res.status(500).json({ status: 500, error: err.toString()});
			res.status(200).json(users);
		});
	},
	getGroups(req, res) {
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
                        _id: group._id,
                        __v: group.__v,
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
	}
};

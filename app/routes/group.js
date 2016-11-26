var express = require('express');
var _ = require('lodash');
var router = express.Router();

var groupController = require('../controller/groupController');

router.post('/', function(req, res) {
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
});

/*
 *  Get the list of users for a group identified by id
 */
router.get('/:id/users', function (req, res) {
    return groupController.getUsers(req, res);
});

router.post('/:id/user', function (req, res) {
    return groupController.addUserToGroup(req, res);
});

/*
 *  Get the list of transactions for a group identified by id
 */
router.get('/:id/transactions', function (req, res) {
    return groupController.getTransactions(req, res);
});

/*
 *  Add a new transaction to the group
 */
router.post('/:id/transaction', function(req, res) {
    return groupController.addTransactionToGroup(req, res);
});

router.get('/:id/balances', function (req, res) {
    return groupController.getBalances(req, res);
});

module.exports = router;

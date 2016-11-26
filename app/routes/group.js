var express = require('express');
var router = express.Router();

var groupController = require('../controller/groupController');

router.post('/', function(req, res) {
    return groupController.createGroup(req, res);
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

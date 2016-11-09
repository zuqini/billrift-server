var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    id: Number,
    userFromId: String,
    userToId: String,
    amount: Number,
    groupId: Number
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

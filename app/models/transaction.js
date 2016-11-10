var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = require('./counter');

var transactionSchema = new Schema({
    id: Number,
    userFromId: String,
    userToId: String,
    amount: Number,
    groupId: Number
});

transactionSchema.pre('save', function(next) {
    var transaction = this;
    Counter.findOneAndUpdate({_id: 'transactionId'}, {$inc: { seq: 1} }, { upsert: true, new: true }, function(err, counter)   {
        if(err) {
            return next(err);
        }
        transaction.id = counter.seq;
        next();
    });
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

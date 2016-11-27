/*
group.js
Model
Reference number: 2.11
This model represents a group, that contains one or more users
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = require('./counter');

var groupSchema = new Schema({
    id : Number,
    name : String,
    userIds : Array
});

groupSchema.pre('save', function(next) {
    var group = this;
    Counter.findOneAndUpdate({_id: 'groupId'}, {$inc: { seq: 1} }, { upsert: true, new: true }, function(err, counter)   {
        if(err) {
            return next(err);
        }
        group.id = counter.seq;
        next();
    });
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;

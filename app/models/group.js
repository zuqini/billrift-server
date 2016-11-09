var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var Counter = mongoose.model('Counter', CounterSchema);

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

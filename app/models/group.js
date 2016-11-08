var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    id : Number,
    name : String,
    userIds : Array
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;

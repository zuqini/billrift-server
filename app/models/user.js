var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    email : String,
    googleId : String,
    groupIds: { type: Array, default: [] }
});

var User = mongoose.model('User', userSchema);

module.exports = User;

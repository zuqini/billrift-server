/*
user.js
Model
Reference number: 2.10
This model represents a user, that contains a name, email, and a google ID
They also keep track of which groups they are members of
*/
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

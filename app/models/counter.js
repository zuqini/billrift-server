/*
counter.js
Model
Reference number: 2.13
This model stores the to-be-created id values for certain models so they are all
unique
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;

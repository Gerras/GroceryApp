// app/model/groceryItem.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroceryItemSchema = new Schema({
    name: String,
    type: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroceryItem', GroceryItemSchema);
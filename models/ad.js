var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var adSchema = new Schema({
    user_id: Number,
    id: Number,
    url: String,
    target: String,
    title: String,
    description: String,
    image: String,
    video: [],
    type: String,
    category: String,
    budget: Number,
    frequency: Number,
    start: Date,
    end: Date,
    cpc: Number,
    visibility: Boolean,
    created: Date,
    live: Boolean,
    modified: { type: Date, default: Date.now }
}, { collection: 'ads' });

var Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;

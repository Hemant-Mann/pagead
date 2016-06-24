var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var bSchema = new Schema({
	url: String,
    user_id: Schema.Types.ObjectId,
    live: Number,
    modified: Date
}, { collection: 'blockedurls' });

var AdsBlocked = mongoose.model('AdsBlocked', bSchema);

module.exports = AdsBlocked;

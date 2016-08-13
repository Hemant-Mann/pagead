var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    org_id: Schema.Types.ObjectId,
    name: String,
    email: String,
    created: Date,
    meta: [],
    live: Boolean,
    modified: { type: Date, default: Date.now }
}, { collection: 'users' });

var User = mongoose.model('User', userSchema);

module.exports = User;

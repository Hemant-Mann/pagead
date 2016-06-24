var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var aduSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    category: String,
    name: String,
    type: [],
    created: Date,
    privacy: String,
    modified: { type: Date, default: Date.now }
}, { collection: 'adunits' });

aduSchema.statics.process = function (opts, cb) {
    var self = this;
    if (!opts.aduid) {
    	return cb(null, opts.find);
    }

    self.findOne({ _id: opts.aduid }, function (err, adunit) {
    	if (adunit.user_id != opts.uid) {  // User is doing something fishy
    		return cb(true, {});
    	}

    	var find = opts.find; // "local" then find ads only by this user
    	if (adunit.privacy == 'local') {
    		find.user_id = adunit.user_id;
    		delete find.privacy;
    	}

    	cb(null, find);
    });
};

var AdUnit = mongoose.model('AdUnit', aduSchema);

module.exports = AdUnit;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var adSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    org_id: Schema.Types.ObjectId,
    title: String,
    description: String,
    url: String,
    image: String,
    category: [Schema.Types.ObjectId],
    type: String,
    category: [],
    device: [],
    created: Date,
    live: Boolean,
    modified: { type: Date, default: Date.now }
}, { collection: 'ads' });

adSchema.statics.deviceQuery = function (ua, device) {
    var deviceTypes = ['ALL'];
    switch (device) {
        case 'mobile':
            if (ua.match(/iphone/i)) {
                deviceTypes.push('iphone');
            } else if (ua.match(/windows/i)) {
                deviceTypes.push('winphone');
            } else {
                deviceTypes.push('android');
            }
            break;

        case 'tablet':
            if (ua.match(/ipad/i)) {
                deviceTypes.push('ipad');
            } else {
                deviceTypes.push('android');
            }
            break;

        case 'desktop':
            if (ua.match(/linux/i)) {
                deviceTypes.push('linux');
            } else if (ua.match(/mac\s+os/i)) {
                deviceTypes.push('mac');
            } else {
                deviceTypes.push('windows');
            }
            break;
    }
    return deviceTypes;
};

var Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;

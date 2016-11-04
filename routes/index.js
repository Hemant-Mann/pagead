var express = require('express');
var router = express.Router();
var config = require('../config');
var Utils = require('../utils');
var request = require('request');

// models
var Ad = require('../models/ad');
var Category = require('../models/category');
var User = require('../models/user');

function sendAd(find, req, res) {
	Ad.find(find, function (err, ads) {
		if (err) {
			return res.status(500).json({ error: "Internal Server Error" });
		}

		var min = 0, max = ads.length - 1;
		var index = Math.floor(Math.random() * (max - min + 1)) + min;
		var ad = ads[index] || {};
		var categories = ad.category || [];

		var str = [];
		Category.find({ _id: { $in: categories }}, function (err, cat) {
			if (cat.length === 0) cat = ["Advertising"];
			
			cat.forEach(function (el) {
				str.push(el.name);
			});

			var adObj = {
				_user_id: ad.user_id,
				_url: ad.url,
				_title: ad.title,
				_image: 'http://'+ config.cdn + '/images/' + ad.image,
				_description: ad.description,
				_id: ad._id,
				_type: ad.type,
				_category: str.join()
			};

			if (ad.video && ad.video.length > 0) {
				adObj._video = ad.video;
				adObj._video = adObj._video.map(function (val) {
					return 'http://'+ config.cdn + '/videos/' + val;
				});
			}

			var cb = req.query.callback;

			res.send(cb + "(" + JSON.stringify(adObj) + ")");
		});
	});
}

router.get('/', function (req, res, next) {
	var t = Date.now(), ua = req.headers['user-agent'];

	// Also find AD based on device type
	var device = Utils.device(req),
		deviceQuery = Ad.deviceQuery(ua, device);

	var find = {
		device: deviceQuery[0],
		link: req.get('Referrer'),
		live: true
	};

	if (find.link.match(/likelovequotes\.com/i)) {
		return res.send("callback(" + JSON.stringify({ error: "Invalid Request" }) + ")");
	}

	var uid = req.query.uid;
	User.findOne({ _id: uid }, 'org_id', function (err, u) {
		if (err || !u) {
			var cb = req.query.callback;

			return res.send(cb + "(" + JSON.stringify({ error: "Invalid Request" }) + ")");
		};
		find.org_id = String(u.org_id);

		// recommendation
		request({
			url: 'http://' + config.serverIp + '/vNative',
			method: 'GET',
			qs: find
		}, function (err, response, body) {
			var ids = [];

			try {
				if (err) throw new Error("Invalid recommendation!!");
				
				var data = JSON.parse(body);
				var ads = data['ads'];

				ads.forEach(function (obj) {
					ids.push(obj._id);
				});

				if (ids.length === 0) {
					throw new Error("Invalid recommendation!!");
				}
				ids.splice(-1); // coz last id is not that relevant

				sendAd({_id: {$in: ids}}, req, res);
			} catch (e) {
				var device = find.device;
				find.device = {$in: ['all', 'ALL', device]};
				delete find.link;

				sendAd(find, req, res);
			}
		});
	});
});

module.exports = router;

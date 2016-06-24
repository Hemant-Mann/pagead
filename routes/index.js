var express = require('express');
var router = express.Router();
var config = require('../config');
// models
var Ad = require('../models/ad');
var Category = require('../models/category');
var BlockedUrl = require('../models/blocked');
var AdUnit = require('../models/adunit');

function sendAd(find, req, res) {
	Ad.find(find, function (err, ads) {
		if (err) {
			return res.status.(500).json({ error: "Internal Server Error" });
		}

		var min = 0, max = ads.length - 1;
		var index = Math.floor(Math.random() * (max - min + 1)) + min;

		var ad = ads[index] || {};
		var categories = ad.category || [];

		var str = [];
		Category.find({ id: { $in: categories }}, function (err, cat) {
			if (!cat) cat = ["Advertising"];
			
			cat.forEach(function (el) {
				str.push(el.name);
			});

			var adObj = {
				_user_id: ad.user_id,
				_url: ad.url,
				_title: ad.title,
				_image: 'http://'+ config.cdn +'/uploads/images/' + ad.image,
				_description: ad.description,
				_id: ad._id,
				_type: ad.type,
				_category: str.join()
			};

			if (ad.video && ad.video.length > 0) {
				adObj._video = ad.video;
				adObj._video = adObj._video.map(function (val) {
					return 'http://'+ config.cdn +'/uploads/videos/' + val;
				});
			}

			var cb = req.query.callback;

			res.send(cb + "(" + JSON.stringify(adObj) + ")");
		});
	});
}

router.get('/', function (req, res, next) {
	var t = Date.now();
	var find = {
		live: true,
		visibility: true,
		start: { $lte: t },
		end: { $gte: t },
		privacy: 'public'
	};

	var uid = req.query.uid;
	// @todo there must be some way to check whether the user asking for the AD
	// with the given params is a valid user

	BlockedUrl.find({ uid: uid }, function (err, r) {
		var urls = [];
		if (!err && r) {
			r.forEach(function (el) {
				urls.push(el.url);
			});
		}

		// @todo convert this query to match for regex of all these websites
		if (urls.length > 0) {
			find.url = { $nin: urls };
		}
		
		// Check whether The Adunit wants 'global' ads or 'local' ads
		Adunit.process({ aduid: req.query.aduid, uid: uid, find: find }, function (err, find) {
			if (err) {
				return res.status.(400).json({ error: "Sorry, We were unable to process your request!" });
			}

			sendAd(find, req, res);
		});
	});
});

module.exports = router;

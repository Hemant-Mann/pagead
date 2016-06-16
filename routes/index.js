var express = require('express');
var router = express.Router();
// models
var Ad = require('../models/ad');
var Category = require('../models/category');
var BlockedUrl = require('../models/blocked');

/* GET home page. */
router.get('/', function (req, res, next) {
	var t = Date.now();
	var find = {
		live: true,
		visibility: true,
		start: { $lte: t },
		end: { $gte: t } 
	};

	var uid = req.query.uid;
	BlockedUrl.find({ uid: uid }, function (err, r) {
		var urls = [];
		if (!err && r) {
			r.forEach(function (el) {
				urls.push(el.url);
			});
		}

		if (urls.length > 0) {
			find.url = { $nin: urls };
		}
		Ad.find(find, function (err, ads) {
			if (err) {
				return next((new Error('Something went wrong!!')));
			}

			var min = 0, max = ads.length - 1;
			var index = Math.floor(Math.random() * (max - min + 1)) + min;

			var ad = ads[index] || {};
			var categories = JSON.parse(ad.category || "[]");

			var str = [];
			Category.find({ id: { $in: categories }}, function (err, cat) {
				cat.forEach(function (el) {
					str.push(el.name);
				});

				var adObj = {
					_user_id: ad.user_id,
					_url: ad.url,
					_title: ad.title,
					_image: 'http://static.vnative.com/uploads/images/' + ad.image,
					_description: ad.description,
					_id: ad._id,
					_category: str.join()
				};

				var cb = req.query.callback;

				res.send(cb + "(" + JSON.stringify(adObj) + ")");
			});
		});
	});
});

module.exports = router;

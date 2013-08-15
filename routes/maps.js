/*
 * Serve JSON to our AngularJS client
 */

var Map = require("../models/map").Map;

exports.show = function(req, res) {
  Map.findOne({_id: req.params.id}, function(err, map) {
    if (err) throw err;
    if (!map) {
      var map = new Map();
      map._id = req.params.id;
      map.save();
    }
    res.json({map: map});
  });
};
/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');

var markerSchema = mongoose.Schema({latitude: 'number', longitude: 'number', label: 'string'});
var Marker = mongoose.model('Marker', markerSchema);

exports.list = function(req, res) {
  Marker.find({}, function(err, markers) {
    if (err) throw err;
    res.json({markers: markers});
  });
};

exports.create = function (req, res) {
  console.log("Session: %j", req.session);
  if (!req.session.markerId) {
    var marker = new Marker(req.body);
    marker.save();
    res.json({marker: marker});
    req.session.markerId = marker._id
  }
  else {
    Marker.findOne({_id: req.session.markerId}, function(err, marker) {
      if (err) throw err;
      res.json({marker: marker});
    });
  }
};
/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');

var markerSchema = mongoose.Schema({latitude: 'number', longitude: 'number', label: 'string'});
var Marker = mongoose.model('Marker', markerSchema);

exports.list = function(req, res) {
  Marker.find({}, function(err, markers) {
    if (!err) {
      res.json({markers: markers});
    }
    else { throw err; }
  });
};

exports.create = function (req, res) {
  var marker = new Marker(req.body);
  marker.save();
  res.json({marker: marker});
};
/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/letsMeet');

var markerSchema = mongoose.Schema({latitude: 'number', longitude: 'number', label: 'string'});
var Marker = mongoose.model('Marker', markerSchema);

exports.list = function(req, res) {  
  Marker.find({}, function(err, items) {
    if (!err) {
      res.json({markers: items});
    }
    else { throw err;}
  });
};

exports.create = function (req, res) {
  var marker = new Marker(req.body);
  marker.save();
  Marker.find({}, function(err, items) {
    if (!err) {
      res.json({marker: marker, markers: items});
    }
    else { throw err;}
  });
};
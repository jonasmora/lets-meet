/*
 * Serve JSON to our AngularJS client
 */

var Marker = require("../models/marker").Marker;

exports.list = function(req, res) {
  Marker.find({}, function(err, markers) {
    if (err) throw err;
    res.json({markers: markers});
  });
};

exports.create = function(req, res) {
  // console.log("Session: %j", req.session);
  if (req.body.type == 'meetMarker') {
    Marker.findOne({type: req.body.type}, function(err, marker) {
      if (err) throw err;
      if (marker) {
        Object.keys(req.body).forEach(function(key) {
          var value = req.body[key];
          marker[key] = value;
        });
        marker.save();
      }
      else {
        marker = new Marker(req.body);
        marker.save();
      }
      res.json({marker: marker});
    });
  }
  else {
    if (!req.session[req.body.type]) {
      var marker = new Marker(req.body);
      marker.save();
      res.json({marker: marker});
      req.session[req.body.type] = marker._id
    }
    else {
      Marker.findOne({_id: req.session[req.body.type]}, function(err, marker) {
        if (err) throw err;
        Object.keys(req.body).forEach(function(key) {
          var value = req.body[key];
          marker[key] = value;
        });
        marker.save();
        res.json({marker: marker});
      });
    }
  }
};

exports.update = function(req, res) {
  // console.log("Session: %j", req.session);
  Marker.findOne({_id: req.params.id}, function(err, marker) {
    if (err) throw err;
    Object.keys(req.body).forEach(function(key) {
      var value = req.body[key];
      marker[key] = value;
    });
    marker.save();
    res.json({marker: marker});
  });
};
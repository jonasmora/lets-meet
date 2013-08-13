/*
 * Serve JSON to our AngularJS client
 */

var Map = require("../models/map").Map;

// Map.collection.remove(function() {});

// var map;
// map = new Map({title: "Title 1", description: "Description 1"});
// map.save();
// map = new Map({title: "Title 2", description: "Description 2"});
// map.save();

exports.list = function(req, res) {
  Map.find({}, function(err, maps) {
    if (err) throw err;
    res.json({maps: maps});
  });
};

exports.create = function(req, res) {
  var map = new Map(req.body);
  map.save();
  res.json({map: map});
};

exports.show = function(req, res) {
  Map.findOne({_id: req.params.id}, function(err, map) {
    if (err) throw err;
    res.json({map: map});
  });
};

exports.update = function(req, res) {
  Map.findOne({_id: req.params.id}, function(err, map) {
    if (err) throw err;
    Object.keys(req.body).forEach(function(key) {
      map[key] = req.body[key];
    });
    map.save();
    res.json({map: map});
  });
};

exports.delete = function(req, res) {
  Map.findOne({_id: req.params.id}, function(err, map) {
    if (err) throw err;
    map.remove();
    res.json({map: map});
  });
};
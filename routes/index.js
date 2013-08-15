
/*
 * GET home page.
 */

var Map = require("../models/map").Map;

exports.index = function (req, res) {
  res.render('index');
};

exports.create_map = function(req, res){
  var map = new Map();
  map.save();
  res.redirect('/maps/' + map.id);
};

exports.show_map = function (req, res) {
  res.render('partials/maps/show');
};
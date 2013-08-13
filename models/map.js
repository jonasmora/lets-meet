var mongoose = require('mongoose');

var mapSchema = mongoose.Schema({title: 'string', description: 'string'});
var Map = mongoose.model('Map', mapSchema);

module.exports = {
  Map: Map
}
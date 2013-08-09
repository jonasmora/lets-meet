var mongoose = require('mongoose');

var markerSchema = mongoose.Schema({latitude: 'number', longitude: 'number', infoWindow: 'string', type: 'string'});
var Marker = mongoose.model('Marker', markerSchema);

module.exports = {
  Marker: Marker
}
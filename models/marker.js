var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var markerSchema = Schema({latitude: 'number', longitude: 'number', infoWindow: 'string', type: 'string', map: { type: ObjectId, ref: 'Map' }});
var Marker = mongoose.model('Marker', markerSchema);

module.exports = {
  Marker: Marker
}
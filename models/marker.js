var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var markerSchema = Schema({latitude: 'number', longitude: 'number', infoWindow: 'string', type: 'string', map: { type: ObjectId, ref: 'Map' }, updated_at: { type: Date, expires: '24h' }});
var Marker = mongoose.model('Marker', markerSchema);

module.exports = {
  Marker: Marker
}
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mapSchema = Schema({title: 'string', description: 'string', updated_at: { type: Date, expires: '24h' }});
var Map = mongoose.model('Map', mapSchema);

module.exports = {
  Map: Map
}
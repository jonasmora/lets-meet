var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mapSchema = Schema({title: 'string', description: 'string'});
var Map = mongoose.model('Map', mapSchema);

module.exports = {
  Map: Map
}
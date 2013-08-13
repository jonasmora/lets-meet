var Map = require("../models/map").Map;
var Marker = require("../models/marker").Marker;

// export function for listening to the socket
module.exports = function(socket) {
  var markers = {peopleMarker: null, meetMarker: null};

  // send the new user their name and a list of markers
  Marker.find({}, function(err, markers) {
    if (err) throw err;
    socket.emit('init', markers);
  });

  Marker.findOne({type: 'meetMarker'}, function(err, marker) {
    if (err) throw err;
    markers.meetMarker = marker;
  });

  // notify other clients that a new marker was created
  socket.on('markers:create', function(data, fn) {
    markers[data.type] = new Marker(data);
    markers[data.type].save();
    socket.broadcast.emit('markers:create', markers[data.type]);
    fn(markers[data.type]);
  });

  // notify other clients that a marker was updated
  socket.on('markers:update', function(data, fn) {
    if (markers[data.type]) {
      Object.keys(data).forEach(function(key) {
        markers[data.type][key] = data[key];
      });
      markers[data.type].save();
      socket.broadcast.emit('markers:update', markers[data.type]);
      fn(markers[data.type]);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function() {
    if (markers.peopleMarker) {
      markers.peopleMarker.remove();
      socket.broadcast.emit('markers:delete', markers.peopleMarker);
    }
  });
};

var Map = require("../models/map").Map;
var Marker = require("../models/marker").Marker;

// export function for listening to the socket
module.exports = function(io, socket) {
  var map;
  var markers = {peopleMarker: null, meetMarker: null};

  function broadcast(ev, marker) {
    socket.leave(map.id);
    io.sockets.in(map.id).emit(ev, {marker: marker});
    socket.join(map.id);
  }
  
  // Set current map, set meet marker and retrieve markers
  socket.on('maps:show', function(data, fn) {
    if (data.id) {
      socket.join(data.id);  
    }
    Map.findOne({_id: data.id}, function(err, m) {
      if (err) throw err;
      map = m;
      Marker.findOne({map: data.id, type: 'meetMarker'}, function(err, marker) {
        if (err) throw err;
        markers.meetMarker = marker;
        Marker.find({map: data.id}, function(err, markers) {
          if (err) throw err;
          fn({markers: markers});  
        });
      });
    });
  });

  // notify other clients that a new marker was created
  socket.on('markers:create', function(data, fn) {
    var marker = new Marker(data);
    marker.session = socket.id;
    marker.map = map;
    marker.save();
    markers[data.type] = marker;
    fn({marker: marker});
    broadcast('markers:create', marker);
  });

  // notify other clients that a marker was updated
  socket.on('markers:update', function(data, fn) {
    var marker = markers[data.type];
    if (marker) {
      Object.keys(data).forEach(function(key) {
        marker[key] = data[key];
      });
      marker.save();
      fn({marker: marker});
      broadcast('markers:update', marker);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function() {
    if (map) {
      socket.leave(map.id);  
    }
    var marker = markers.peopleMarker;
    if (marker) {
      marker.remove();
      broadcast('markers:delete', marker);
    }
  });
};

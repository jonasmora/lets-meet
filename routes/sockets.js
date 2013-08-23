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

  // notify other clients that a marker was pushed
  socket.on('markers:push', function(data, fn) {
    var marker = markers[data.type];
    if (marker) {
      Object.keys(data).forEach(function(key) {
        marker[key] = data[key];
      });
    }
    else {
      var marker = new Marker(data);
      marker.session = socket.id;
      marker.map = map;
      markers[data.type] = marker;
    }
    marker.save();
    fn({marker: marker});
    broadcast('markers:push', marker);
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function() {
    var marker = markers.peopleMarker;
    if (marker) {
      marker.remove();
      broadcast('markers:delete', marker);
    }
    if (map) {
      socket.leave(map.id);
      // TODO: Add updated_at to maps, delete the old ones including the markers
      Marker.find({map: map.id}, function(err, markers) {
        if (err) throw err;
        if (markers.length == 0) {
          map.remove();
        }
      });
    }
  });
};

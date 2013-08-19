'use strict';

/* Controllers */

function ShowMapCtrl($scope, $http, $routeParams, socket, $cookies, $log) {
  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  google.maps.visualRefresh = true;

  angular.extend($scope, {

    // the initial center of the map
    center: {
      latitude: 45,
      longitude: -73
    },

    // the initial zoom level of the map
    zoom: 12,

    // list of markers to put in the map
    markers: [],

    // These 2 properties will be set when clicking on the map
    latitude: null,  
    longitude: null,

    events: {
      click: function() {
        angular.extend($scope.meetMarker, {
          latitude: $scope.latitude,
          longitude: $scope.longitude
        });
        pushMarker('meetMarker');
      }
    }
  });

  ['peopleMarker', 'meetMarker'].forEach(function(type) {
    $scope[type] = {type: type};
  });
  $scope.modal = {};

  $http.get('/api/maps/' + $routeParams.id).
    success(function(data) {
      $scope.map = data.map;

      socket.emit('maps:show', {id: $scope.map._id}, function(data) {
        $scope.markers = data.markers;
        configMarkers();

        $scope.peopleMarker.infoWindow = $cookies[$scope.map._id];
        $scope.modal.peopleMarkerTag = $cookies[$scope.map._id];

        watchPosition();
      });
    });

  // Socket listeners

  socket.on('markers:push', pushCallback);

  socket.on('markers:delete', function(data) {
    var index = findMarkerIndex(data.marker);
    if (index != -1) {
      $scope.markers.splice(index, 1);
    }
  });

  // Private helpers

  function findMarkerIndex(marker) {
    var index = -1;

    angular.forEach($scope.markers, function(m, i) {
      if (m._id == marker._id) {
        index = i;
        return;
      }
    });

    return index;
  }

  function configMarker(marker) {
    if ($scope.peopleMarker._id == marker._id) {
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
    else if (marker.type == 'meetMarker') {
      $scope.meetMarker = marker;
      $scope.modal.meetMarkerTag = marker.infoWindow;
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
    else {
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
  }

  function configMarkers() {
    $scope.markers.forEach(function(marker) {
      configMarker(marker);
    });
  }

  function watchPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        $scope.center = {
          latitude: lat,
          longitude: lng
        };

        angular.extend($scope.peopleMarker, $scope.center);

        pushMarker('peopleMarker');
      });
    }
  }

  function filterMarker(type, keys) {
    var marker = $scope[type];
    var data = {};
    keys.forEach(function(key) {
      if (marker[key]) {
        data[key] = marker[key];
      }
    });
    return data;
  }

  function pushMarker(type) {
    var data = filterMarker(type, ['type', 'latitude', 'longitude', 'infoWindow']);

    $log.log("pushMarker data: ", data);

    socket.emit('markers:push', data, function(data) {
      $scope[type] = data.marker;

      if (type == 'peopleMarker') {
        $cookies[$scope.map._id] = $scope[type].infoWindow;
      }
      $scope.modal[type + 'Tag'] = data.marker.infoWindow;

      pushCallback(data);
    });
  }

  function pushCallback(data) {
    $log.log("pushCallback data: ", data);
    var marker = data.marker;
    configMarker(marker);
    var index = findMarkerIndex(marker);
    if (index != -1) {
      $scope.markers[index] = marker;
    }
    else {
      $scope.markers.push(marker);
    }
  }

  // Methods published to the scope

  $scope.saveModal = function(dismiss) {
    ['peopleMarker', 'meetMarker'].forEach(function(type) {
      if ($scope.modal[type + 'Tag'] != $scope[type].infoWindow) {
        $scope[type].infoWindow = $scope.modal[type + 'Tag'];
        pushMarker(type);
      }
    });
    dismiss();
  }
}
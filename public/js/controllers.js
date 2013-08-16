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
        pushMarker('meetMarker', $scope.latitude, $scope.longitude);
      }
    }
  });

  $http.get('/api/maps/' + $routeParams.id).
    success(function(data) {
      $scope.map = data.map;

      socket.emit('maps:show', {id: $scope.map._id}, function(data) {
        $scope.markers = data.markers;
        configMarkers();
        // $scope['peopleMarker'] = JSON.parse($cookies[$scope.map._id + 'peopleMarker']);
        watchPosition();
      });
    });

  // Socket listeners

  socket.on('markers:pushed', pushCallback);

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
    if ($scope.peopleMarker && marker._id == $scope.peopleMarker._id) {
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
    else if (marker.type == 'meetMarker') {
      $scope.meetMarker = marker;
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
    else {
      marker.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
  }

  function configMarkers() {
    angular.forEach($scope.markers, function(marker, index) {
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

        pushMarker('peopleMarker', lat, lng);
      });
    }
  }

  function pushMarker(type, lat, lng) {
    var marker = {
      type: type,
      latitude: lat,
      longitude: lng
    };

    socket.emit('markers:push', marker, function(data) {
      $scope[data.marker.type] = data.marker;
      // $cookies[$scope.map._id + type] = JSON.stringify(data.marker);
      pushCallback(data);
    });
  }

  function pushCallback(data) {
    // $log.log("data: ", data);
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

  $scope.updatePeopleMarker = function() {
    if ($scope['peopleMarker'].infoWindow.length > 0) {
      pushMarker('peopleMarker');
    }
  }

  $scope.updateMeetMarker = function() {
    if ($scope['meetMarker'].infoWindow.length > 0) {
      pushMarker('meetMarker');
    }
  }
}
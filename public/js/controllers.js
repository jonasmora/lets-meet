'use strict';

/* Controllers */


function GeolocationListCtrl($scope, socket, $cookies, $timeout, $http, $log) {

  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  google.maps.visualRefresh = true;

  angular.extend($scope, {

    /** the initial center of the map */
    center: {
      latitude: 45,
      longitude: -73
    },

    /** the initial zoom level of the map */
    zoom: 12,

    /** list of markers to put in the map */
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

  // Load marker from previous session
  watchPosition();

  // Socket listeners
  // ================

  socket.on('init', function(data) {
    $scope.markers = data;
    configMarkers();
  });

  socket.on('markers:create', function(data) {
    var index = findMarkerIndex(data);
    if (index == -1) {
      $scope.markers.push(data);
    }
  });

  socket.on('markers:update', function(data) {
    var index = findMarkerIndex(data);
    if (index != -1) {
      $scope.markers[index] = data;
    }
  });

  socket.on('markers:delete', function(data) {
    var index = findMarkerIndex(data);
    if (index != -1) {
      $scope.markers.splice(index, 1);
    }
  });

  // Private helpers
  // ===============

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
    var e = {};

    if (!$scope[type]) {
      e.name = 'markers:create';
      var m = JSON.parse($cookies[type]);
      if (m) {
        e.data = {type: type, infoWindow: m.infoWindow};
      }
      else {
        e.data = {type: type};
      }
    }
    else {
      e.name = 'markers:update';
      e.data = {type: type, _id: $scope[type]._id};
    }
    e.data.latitude = lat;
    e.data.longitude = lng;

    // $log.log("e: ", e);

    socket.emit(e.name, e.data, pushCallback);
  }

  function pushCallback(marker) {
    // $log.log("marker: ", marker);
    $scope[marker.type] = marker;
    configMarker(marker);
    $cookies[marker.type] = JSON.stringify(marker);
    var index = findMarkerIndex(marker);
    if (index != -1) {
      $scope.markers[index] = marker;
    }
    else {
      $scope.markers.push(marker);
    }
  }

  // Methods published to the scope
  // ==============================

  $scope.updatePeopleMarker = function() {
    socket.emit('markers:update', $scope.peopleMarker, pushCallback);
  }

  $scope.updateMeetMarker = function() {
    socket.emit('markers:update', $scope.meetMarker, pushCallback);
  }

}
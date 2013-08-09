(function () {
  var module = angular.module("letsMeet", ["google-maps"]).directive('input', function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function(scope, elm, attr, ngModelCtrl) {
        if (attr.type === 'radio' || attr.type === 'checkbox') return;
        elm.unbind('input').unbind('keydown').unbind('change');
        elm.bind('blur', function() {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(elm.val());
          });
        });
      }
    };
  });
}());

function GeolocationListCtrl($scope, $timeout, $http, $log) {

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
      click: function (scope, mapModel, eventName, originalEventArgs) {
        // 'this' is the directive's scope
        // console.log("my Click!");

        // Object.keys(scope).forEach(function(key) {
        //   var value = scope[key];
        //   console.log(key + ": " + value);
        // });

        // $log.log("$scope.markers.length: " + $scope.markers.length);
        // // $log.log("POST meet marker");
        // $log.log($scope.markers);

        postMeetMarker(scope.latitude, scope.longitude);
      }
    }
  });

  $scope.enableSync = true;

  function onTimeout() {
    postMarker();
    getMarkers();
    $scope.timeout = $timeout(onTimeout, 3000);
  }

  onTimeout();

  function isMyMarker(marker) {
    return $scope.myMarker && marker._id == $scope.myMarker._id;
  }

  function isMeetMarker(marker) {
    return marker.type == 'meetMarker';
  }

  function configMarker(marker) {
    if (isMyMarker(marker)) {
      marker.icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    else if (isMeetMarker(marker)) {
      $scope.meetMarker = marker;
      $scope.meetInfoWindow = marker.infoWindow;
      marker.icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
    else {
      marker.icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
    marker.id = marker._id;
    marker.infoWindow = marker.infoWindow;
  }

  function configMarkers(markers) {
    angular.forEach(markers, function(marker, index) {
      configMarker(marker);
    });
  }

  function findMarkerIndex(marker) {
    angular.forEach($scope.markers, function(v, i) {
      if (v._id == marker._id) {
        return i;
      }
    });
    return -1;
  }

  function postMarker() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $scope.center = {
          type: 'peopleMarker',
          latitude: latitude,
          longitude: longitude,
          infoWindow: $scope.myInfoWindow
        };
        $http.post('/api/markers', $scope.center).
          success(function(data) {
            $scope.myMarker = data.marker;
            configMarker(data.marker);
            var index = findMarkerIndex(data.marker);
            if (index == -1) {
              $scope.markers.push(data.marker);
            }
            else {
              $scope.markers[i] = data.marker;
            }
            $scope.myInfoWindow = data.marker.infoWindow;
            // $log.log("POST my marker");
            // $log.log("$scope.markers.length: " + $scope.markers.length);
            // $log.log($scope.markers);
          });
        $scope.$apply();
      }, function() {
      });
    }
  }

  function getMarkers() {
    $http.get('/api/markers').
      success(function(data) {
        configMarkers(data.markers);
        $scope.markers = data.markers;
        // $log.log("GET markers");
        // $log.log("$scope.markers.length: " + $scope.markers.length);
        // $log.log($scope.markers);
      });
  }

  function postMeetMarker(lat, lng) {
    var data = {
      type: 'meetMarker',
      latitude: lat,
      longitude: lng,
      infoWindow: $scope.meetInfoWindow
    };
    $http.post('/api/markers', data).
      success(function(data) {
        $scope.meetMarker = data.marker;
        configMarker(data.marker);
        var index = findMarkerIndex(data.marker);
        if (index == -1) {
          $scope.markers.push(data.marker);
        }
        else {
          $scope.markers[i] = data.marker;
        }
        $scope.meetInfoWindow = data.marker.infoWindow;
        // $log.log("POST meet marker");
        // $log.log("$scope.markers.length: " + $scope.markers.length);
        // $log.log($scope.markers);
      });
  }

  $scope.updateEnableSync = function() {
    if ($scope.enableSync) {
      onTimeout();
    }
    else {
      $timeout.cancel($scope.timeout);
    }
  }

  $scope.updateMyInfoWindow = function() {
    if ($scope.myMarker) {
      $scope.myMarker.infoWindow = $scope.myInfoWindow;
      $http.put('/api/markers/' + $scope.myMarker._id, $scope.myMarker).
        success(function(data) {
          $log.log(data);
        });
    }
  }

  $scope.updateMeetInfoWindow = function() {
    $log.log("updateMeetInfoWindow");
    $log.log($scope.meetMarker);
    if ($scope.meetMarker) {
      $scope.meetMarker.infoWindow = $scope.meetInfoWindow;
      $http.put('/api/markers/' + $scope.meetMarker._id, $scope.meetMarker).
        success(function(data) {
          $log.log(data);
        });
    }
  }

}
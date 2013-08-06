(function () {
  var module = angular.module("letsMeet", ["google-maps"]);
}());

function GeolocationListCtrl($scope, $timeout, $http, $log) {

  angular.extend($scope, {
    center: {
      latitude: 0, // initial map center latitude
      longitude: 0, // initial map center longitude
    },
    markers: [], // an array of markers,
    zoom: 12, // the zoom level
  });

  function onTimeout() {
    postMarker();
    getMarkers();
    // $timeout(onTimeout, 5000);
  }

  onTimeout();
  $timeout(onTimeout, 5000);
  $timeout(onTimeout, 10000);

  function findMarkerIndex(marker) {
    for (var i = 0; i < $scope.markers.length; i++) {
      if ($scope.markers[i]._id == marker.id) {
        return i;
      }
    }
    return -1;
  }

  function updateMarker(marker) {
    // $log.log("updateMarker");
    if (marker) {
      if (marker.index == -1) {
        marker.index = $scope.markers.length;
        $scope.markers.push(marker);
      }
      else {
        $scope.markers[marker.index] = marker;
      }
      $scope.fit = true;
    }
  }

  function updateMarkers(markers) {
    $scope.markers = markers;
    $scope.fit = true;
  }

  function configMarker(marker) {
    // $log.log("configMarker");
    marker.infoWindow = marker.label;
    marker.index = findMarkerIndex(marker);
  }

  function configMyMarker(marker) {
    // $log.log("configMyMarker");
    $scope.myMarker = marker;
    $scope.markerLabel = marker.label;
    marker.icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    configMarker(marker);
  }

  function configMarkers(markers) {
    angular.forEach(markers, function(marker, index) {
      configMarker(marker);
    });
  }

  function postMarker() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var data = {
          latitude: latitude,
          longitude: longitude
        };
        $http.post('/api/markers', data).
          success(function(data) {
            configMyMarker(data.marker);
            updateMarker(data.marker);
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
        updateMarkers(data.markers);
        updateMarker($scope.myMarker);
      });
  }

  $scope.updateMarkerLabel = function() {
  //   $http.put('/api/markers/' + $scope.markerId, {label: $scope.markerLabel}).
  //     success(function(data) {
  //       if (data.marker.label) {
  //         angular.forEach($scope.markers, function(v, i) {
  //           if (v._id == data.marker._id) {
  //             v.infoWindow = data.marker.label;
  //             return;
  //           }
  //         });
  //         // $scope.$apply();
  //       }
  //       // $log.log("Update Marker Callback");
  //       // $log.log(data);
  //       // $log.log($scope.markers);
  //     });
  };

}
(function () {
  var module = angular.module("letsMeet", ["google-maps"]);
}());

function GeolocationListCtrl($scope, $http, $log) {

  angular.extend($scope, {
    center: {
      latitude: 0, // initial map center latitude
      longitude: 0, // initial map center longitude
    },
    markers: [], // an array of markers,
    zoom: 12, // the zoom level
  });

  $scope.geolocationAvailable = navigator.geolocation ? true : false;

  if ($scope.geolocationAvailable) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      $scope.center = {
        latitude: latitude,
        longitude: longitude
      };
      $http.post('/api/markers', {latitude: latitude, longitude: longitude, label: $scope.label}).
        success(function(data) {
        });
      $scope.$apply();
    }, function() {
    });
  }

  $http.get('/api/markers').
    success(function(data) {
      if (data.markers.length > 1) {
        $scope.center = {
          latitude: data.markers[0].latitude,
          longitude: data.markers[0].longitude
        };
      }
      angular.forEach(data.markers, function(v, i) {
        if (v.label) {
          v.infoWindow = v.label;
        }
      });
      $scope.markers = data.markers;
    });

}
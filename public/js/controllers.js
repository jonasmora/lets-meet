(function () {
  var module = angular.module("letsMeet", ["google-maps"]);
}());

function GeolocationListCtrl($scope) {

  angular.extend($scope, {
    center: {
      latitude: 0, // initial map center latitude
      longitude: 0, // initial map center longitude
    },
    markers: [], // an array of markers,
    zoom: 8, // the zoom level
  });

  $scope.geolocationAvailable = navigator.geolocation ? true : false;

  $scope.findMe = function() {
    if ($scope.geolocationAvailable) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.center = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        $scope.$apply();
      }, function () {
      });
    }
  };

}
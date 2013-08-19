'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('letsMeet', ['google-maps', 'ngCookies', '$strap.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/maps/:id', {
        templateUrl: '/partials/maps/show'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
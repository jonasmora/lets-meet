'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('letsMeet', ['letsMeet.directives', 'google-maps', 'ngCookies']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/maps/list'
      }).
      when('/maps', {
        templateUrl: '/partials/maps/list'
      }).
      when('/maps/new', {
        templateUrl: '/partials/maps/new'
      }).
      when('/maps/:id', {
        templateUrl: '/partials/maps/show'
      }).
      when('/maps/:id/edit', {
        templateUrl: '/partials/maps/edit'
      }).
      when('/maps/:id/delete', {
        templateUrl: '/partials/maps/delete'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
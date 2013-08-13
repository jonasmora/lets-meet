'use strict';

/* Directives */

angular.module('letsMeet.directives', []).
  directive('input', function() {
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
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

// app.provider('$cookieStore', function() {
//   this.$get = function() {
//     return {
//       get: function(name) {
//         return $.cookie(name);
//       },
//       set: function(name, value, options) {
//         if (options && options.expires) {
//           $.cookie(name, value, {expires: options.expires});
//         }
//         else {
//           $.cookie(name, value);
//         }
//       },
//       remove: function(name) {
//         $.removeCookie(name);
//       }
//     }
//   };
// });
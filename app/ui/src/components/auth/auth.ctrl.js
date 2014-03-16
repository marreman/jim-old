(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('AuthCtrl', [
      '$scope', 'AuthService',
      function ($scope, AuthService) {
        $scope.login = function () {
          AuthService.login();
        };
      }
    ]);

}(window));
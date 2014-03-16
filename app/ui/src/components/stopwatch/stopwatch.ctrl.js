(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('StopwatchCtrl', [
      '$scope', '$interval',
      function ($scope, $interval) {
        var i, time = 0;

        $scope.stopwatch = {
          running: false,
          time: 0
        };

        i = $interval(function () {
          if ($scope.stopwatch.running) {
            time = parseFloat($scope.stopwatch.time);
            $scope.stopwatch.time = (time += 0.1).toFixed(1);
          }
        }, 100);

      }
    ]);

}(window));
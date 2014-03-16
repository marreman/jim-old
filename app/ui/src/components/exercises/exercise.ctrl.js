(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('ExerciseCtrl', [
      '$scope', '$stateParams', '$firebase', 'DataService',
      function ($scope, $stateParams, $firebase, DataService) {
        var ref = DataService.exercises.child($stateParams.id);
        $scope.exercise = $firebase(ref);
      }
    ]);

}(window));
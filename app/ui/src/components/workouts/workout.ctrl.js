(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('WorkoutCtrl', [
      '$scope', '$stateParams', '$firebase', 'DataService',
      function ($scope, $stateParams, $firebase, DataService) {
        var workoutRef = DataService.workouts.child($stateParams.id);

        function addSessionToList(snap) {
          $scope.sessions[snap.name()] = snap.val();
        }

        function fetchSessionsFromWorkout(snap) {
          for (var name in snap.val().sessions) {
            DataService.sessions.child(name).once('value', addSessionToList);
          }
        }

        $scope.workout = $firebase(workoutRef);
        $scope.exercises = $firebase(DataService.exercises);
        $scope.sessions = {};

        workoutRef.on('value', fetchSessionsFromWorkout);
      }
    ]);

}(window));
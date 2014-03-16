(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('WorkoutListCtrl', [
      '$scope', '$ionicModal', 'paths', '$firebase', 'TimeService', 'DataService',
      function ($scope, $ionicModal, paths, $firebase, TimeService, DataService) {
        var url = paths.components + '/workouts/new-workout-modal.html';

        $ionicModal.fromTemplateUrl(url, function(modal) {
          $scope.modal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        $scope.workouts = $firebase(DataService.workouts);
        $scope.exercises = $firebase(DataService.exercises);
        $scope.workout = { date: TimeService.now().toISOString(), sessions: {} }; // boilerplate for new workout

        $scope.createWorkout = function (newWorkout) {
          var workout = DataService.create('workouts', newWorkout);

          for (var exerciseName in $scope.exercises) {
            if (!$scope.exercises[exerciseName].selected) {
              continue;
            }

            DataService.create('sessions', {
              date: TimeService.now().toISOString(),
              exercise: exerciseName,
              workout: workout.name()
            });
          }

          $scope.modal.hide();
        };
      }
    ]);

}(window));
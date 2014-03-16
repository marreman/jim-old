(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('ExerciseListCtrl', [
      '$scope', '$ionicModal', 'paths', '$firebase', 'DataService',
      function ($scope, $ionicModal, paths, $firebase, DataService) {
        var url = paths.components + '/exercises/new-exercise-modal.html';

        $ionicModal.fromTemplateUrl(url, function(modal) {
          $scope.modal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        $scope.exercises = $firebase(DataService.exercises);
        $scope.exercise = { name: null, sessions: {} }; // boilerplate for new exercise

        $scope.createExercise = function (newExercise) {
            DataService.create('exercises', newExercise);
            $scope.modal.hide();
        };
      }
    ]);

}(window));
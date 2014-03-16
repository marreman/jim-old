(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim');

    module.controller('SessionCtrl', [
      '$scope', '$stateParams', '$ionicModal', 'paths', '$firebase', 'DataService',
      function ($scope, $stateParams, $ionicModal, paths, $firebase, DataService) {
        var url = paths.components + '/sessions/set-modal.html',
            session = DataService.sessions.child($stateParams.id),
            set = null;

        $scope.session = $firebase(session);
        $scope.exercises = $firebase(DataService.exercises);

        // set modal
        $ionicModal.fromTemplateUrl(url, function(modal) {
          $scope.modal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        $scope.editSet = function (name) {
          if (!name) {
            name = session.child('/sets').push({ reps: 0, weight: 0 }).name();
          }

          set = session.child('/sets/' + name);
          set.on('value', function (snap) {
            $scope.set = snap.val();
          });

          $scope.modal.show();
        };

        $scope.editDone = function () {
          session.child('/sets/' + set.name()).set($scope.set);
          $scope.modal.hide();
          $scope.set = null;
        };

        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
      }
    ]);

}(window));
(function (window) {

    "use strict";

    var angular = window.angular,
        module = angular.module('jim', ['ionic', 'firebase']);

    module.constant('paths', {
      components: '/ui/src/components'
    });

    module.config(function($stateProvider, $urlRouterProvider) {

      $stateProvider.state('login', {
        url: '/login',
        controller: 'AuthCtrl',
        templateUrl: '/ui/src/components/auth/auth.html',
        auth: false
      });

      $stateProvider.state('tabs', {
        url: '',
        abstract: true,
        templateUrl: '/ui/src/global/tabs.html'
      });

      $stateProvider.state('tabs.exercise-list', {
        url: '/exercises',
        views: {
          'exercises': {
            controller: 'ExerciseListCtrl',
            templateUrl: '/ui/src/components/exercises/exercise-list.html'
          }
        }
      });

      $stateProvider.state('tabs.exercise', {
        url: '/exercises/:id',
        views: {
          'exercises': {
            controller: 'ExerciseCtrl',
            templateUrl: '/ui/src/components/exercises/exercise.html'
          }
        }
      });

      $stateProvider.state('tabs.workout-list', {
        url: '/workouts',
        views: {
          'workouts': {
            controller: 'WorkoutListCtrl',
            templateUrl: '/ui/src/components/workouts/workout-list.html'
          }
        }
      });

      $stateProvider.state('tabs.workout', {
        url: '/workouts/:id',
        views: {
          'workouts': {
            controller: 'WorkoutCtrl',
            templateUrl: '/ui/src/components/workouts/workout.html'
          }
        }
      });

      $stateProvider.state('tabs.timer', {
        url: '/stopwatch',
        views: {
          'stopwatch': {
            controller: 'StopwatchCtrl',
            templateUrl: '/ui/src/components/stopwatch/stopwatch.html'
          }
        }
      });

      $stateProvider.state('tabs.session', {
        url: '/sessions/:id',
        views: {
          'workouts': {
            controller: 'SessionCtrl',
            templateUrl: '/ui/src/components/sessions/session.html'
          }
        }
      });

      $urlRouterProvider.otherwise('/login');

    });

    module.run(['$state', 'Mediator', 'AuthService', function ($state, Mediator, AuthService) {

        Mediator.subscribe('$stateChangeStart', function(event, curr){
          if (curr.auth !== false && !AuthService.user) {
            $state.transitionTo('login');
            event.preventDefault();
          }
        });

        Mediator.subscribe('$firebaseSimpleLogin:login', function () {
          $state.go('tabs.exercise-list');
        });

    }]);


}(window));
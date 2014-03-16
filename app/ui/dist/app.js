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
(function (window) {

  "use strict";

  var angular = window.angular,
      Firebase = window.Firebase,
      app = angular.module('jim'),
      fbRoot = new Firebase('https://amend.firebaseio.com');

  function NoSuchEntityException(value) {
    this.value = value;
    this.message = "No such entity as: ";
    this.toString = function() {
      return this.message + this.value;
    };
  }

  app.service('AuthService', [
    '$firebaseSimpleLogin', 'Mediator',
    function ($firebaseSimpleLogin, Mediator) {
      var _this = this,
          simpleLogin = $firebaseSimpleLogin(fbRoot);

      Mediator.subscribe('$firebaseSimpleLogin:login', function (e, user) {
        _this.user = user;
      });

      this.login = function () {
        return simpleLogin.$login('facebook');
      };
    }
  ]);

  app.service('DataService', [
    'AuthService',
    function (AuthService) {
      var _this = this,
          fb = fbRoot.child(AuthService.user.uid);

      this.sessions = fb.child('/sessions');
      this.exercises = fb.child('/exercises');
      this.workouts = fb.child('/workouts');

      this.sessions.on('child_added', function (snap) {
        var name = snap.name(),
            session = snap.val(),
            path = '/sessions/' + name;

        _this.exercises.child(session.exercise + path).set(true);
        _this.workouts.child(session.workout + path).set(true);
      });

      this.create = function (type, data) {
        var ref = this[type];

        if (!ref) {
          throw new NoSuchEntityException(type);
        }

        return ref.push(data);
      };
    }
  ]);

}(window));
(function (window) {

  "use strict";

  var angular = window.angular;

  angular.module('jim').filter('len', [
    function () {
      return function (subject) {
        var name,
            numMembers = 0;

        if (subject) {
          for (name in subject) {
            if (subject.hasOwnProperty(name)) {
              numMembers += 1;
            }
          }
        }

        return numMembers;
      };
    }
  ]);

}(window));

(function (window) {

    "use strict";

    var angular = window.angular,
        app = angular.module('jim');

    app.service('Mediator', ['$rootScope', function ($rootScope) {

        this.publish = function (eventName, eventData) {
            $rootScope.$broadcast(eventName, eventData);
        };

        this.subscribe = function (eventName, fn) {
            $rootScope.$on(eventName, fn);
        };

    }]);

}(window));
(function (window) {

  "use strict";

  var moment = window.moment,
      angular = window.angular,
      app = angular.module('jim');

  moment.lang('sv');

  app.service('TimeService', [function () {

    this.local = function (dateString) {
      return moment(dateString);
    };

    this.utc = function (dateString) {
      return moment.utc(dateString);
    };

    this.now = function () {
      return moment();
    };

  }]);

  app.filter('date', ['TimeService', function (TimeService) {

    return function (dateString) {
      if (dateString) {
        return TimeService.utc(dateString).format('LLLL');
      }

    };

  }]);

}(window));
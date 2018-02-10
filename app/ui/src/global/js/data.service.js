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
        window.console.log("login");
        return simpleLogin.$login('anonymous');
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

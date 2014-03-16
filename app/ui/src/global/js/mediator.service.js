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
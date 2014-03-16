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
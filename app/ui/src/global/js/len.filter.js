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

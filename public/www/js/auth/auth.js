(function() {
  angular
    .module('dive')
    .factory('Auth', function ($http, $location) {

      var login = function (user) {
        return $http({
          method: 'POST',
          url: '/users/login',
          data: user
        })
        .then(function (resp) {
          // Do something upon successful login
        });
      };

      var signup = function (user) {
        return $http({
          method: 'POST',
          url: '/users/signup',
          data: user
        })
        .then(function (resp) {
          // Do something upon successful signup
        });
      };

      var signout = function () {
        $location.path('/login');
      };


      return {
        login: login,
        signup: signup,
        signout: signout
      };
    });
})();

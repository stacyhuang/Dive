(function() {
  var serverUrl = "http://tranquil-badlands-7300.herokuapp.com"
  angular
    .module('dive')
    .factory('AuthFactory', function ($http, $location, $window) {

      var login = function (user) {
        return $http({
          method: 'POST',
          url: serverUrl + '/users/login',
          data: user,
          contentType: "application/json"
        })
        .then(function (resp) {
          return resp.data.token;
        });
      };

      var signup = function (user) {
        return $http({
          method: 'POST',
          url: serverUrl + '/users/signup',
          data: user,
          contentType: "application/json"
        })
        .then(function (resp) {
          return resp.data.token
        });
      };

      var isAuthorized = function(){
        return !!$window.localStorage.getItem('com.dive');
      }

      var signout = function () {
        $window.localStorage.removeItem('com.dive');
        $location.path('/login');
      };

      return {
        login: login,
        signup: signup,
        isAuthorized: isAuthorized,
        signout: signout
      };
    });
})();


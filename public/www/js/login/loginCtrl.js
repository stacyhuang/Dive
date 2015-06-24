(function() {

  angular
    .module('dive')

    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', '$location', '$window', 'AuthFactory'];

  function LoginCtrl($scope, $location, $window, AuthFactory){

  	$scope.user = {};

  	$scope.login = function() {
      AuthFactory.login($scope.user)
        .then(function(token){
          $window.localStorage.setItem('com.dive', token);
          $location.path('/app/location');
        })
        .catch(function(error){
          console.error(error);
        })
  	};
  }

})();

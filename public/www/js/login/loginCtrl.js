(function() {

  angular
    .module('dive')

    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', '$location', 'AuthFactory'];

  function LoginCtrl($scope, $location, AuthFactory){

  	$scope.user = {};

  	$scope.login = function() {
      $location.path('/app/location');
      // AuthFactory.login($scope.user).then(function(response){
      //   $location.path('/app/setlocation');
      // });
  	};
  }

})();

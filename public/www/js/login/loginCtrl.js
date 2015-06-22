(function() {

  angular
    .module('dive')

    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', '$location', 'Auth'];

  function LoginCtrl($scope, $location, Auth){

  	$scope.user = {};

  	$scope.login = function() {
      $location.path('/app/location');
      // Auth.login($scope.user).then(function(response){
      //   $location.path('/app/setlocation');
      // });
  	};
  }

})();

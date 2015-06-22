(function() {

  angular
    .module('dive')

    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$scope', '$location', 'Auth'];

  function SignupCtrl($scope, $location, Auth){

  	$scope.user = {};

  	$scope.signup = function() {
      $location.path('/#/location');
      // Auth.login($scope.user).then(function(response){
      //   $location.path('/app/setlocation');
      // });
  	};
  }

})();

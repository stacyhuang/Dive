(function() {

  angular
    .module('dive')

    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$scope', '$location', 'AuthFactory'];

  function SignupCtrl($scope, $location, AuthFactory){

  	$scope.user = {};

  	$scope.signup = function() {
      $location.path('/app/location');
      // AuthFactory.login($scope.user).then(function(response){
      //   $location.path('/app/location');
      // });
  	};
  }

})();

(function() {

  angular
    .module('dive')

    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$scope', '$location', 'AuthFactory'];

  function SignupCtrl($scope, $location, AuthFactory){

  	$scope.user = {};

  	$scope.signup = function() {
      AuthFactory.signup($scope.user)
        .then(function(token){
          $window.locatStorage.setItem('com.dive', token);
          $location.path('/app/location');
      }).catch(function(error){
        console.error(error);
      })
  	};
  }

})();
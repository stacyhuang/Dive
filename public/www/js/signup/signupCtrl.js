(function() {

  angular
    .module('dive')

    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$scope'];

  function SignupCtrl($scope){

  	$scope.user = {};

  	$scope.signup = function() {
      console.log('Success');
  	};
  }

})();

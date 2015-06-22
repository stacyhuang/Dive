(function() {

  angular
    .module('dive')

    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope'];

  function LoginCtrl($scope){

  	$scope.user = {};

  	$scope.login = function() {
      console.log('Success');
  	};
  }

})();

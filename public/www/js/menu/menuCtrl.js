(function() {

  angular
    .module('dive')

    .controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['$scope', '$location', 'AuthFactory'];

  function MenuCtrl($scope, $location, AuthFactory){

  	$scope.signout = function() {
      AuthFactory.signout()
  	};
  }

})();

(function() {

  angular
    .module('dive')

    .controller('LocationCtrl', LocationCtrl);

  LocationCtrl.$inject = ['$scope', '$location'];

  function LocationCtrl($scope, $location){

  	$scope.search = {};

  	$scope.searchLocation = function() {
      $location.path('/app/main');
      // Auth.login($scope.search).then(function(response){
      //   $location.path('/app/main');
      // });
  	};
  }

})();

(function() {

  angular
    .module('dive')

    .controller('LocationCtrl', LocationCtrl);

  LocationCtrl.$inject = ['$scope', '$location', 'LocationFactory'];

  function LocationCtrl($scope, $location, LocationFactory){

  	$scope.search = {};

  	$scope.searchLocation = function() {
      $location.path('/app/main');
      // LocationFactory.searchLocation($scope.search.location).then(function(response){
      //   $location.path('/app/main');
      // });
  	};
  }

})();

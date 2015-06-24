(function() {

  angular
    .module('dive')

    .controller('LocationCtrl', LocationCtrl);

  LocationCtrl.$inject = ['$scope', '$location', 'LocationFactory', '$rootScope', '$timeout'];

  function LocationCtrl($scope, $location, LocationFactory, $rootScope, $timeout){
    $rootScope.$on('newInfo', function(){
       $timeout(function() {
        console.log("BROADCAST HEARD");
          $scope.searchLocation();
      });
    })
  	$scope.search = {};

  	$scope.searchLocation = function() {
      // $location.path('/app/main');
      LocationFactory.searchLocation($scope.search.location).then(function(response){
        $location.path('/app/main');
      });
  	};
  }

})();

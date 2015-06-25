(function() {

  angular
    .module('dive')

    .controller('LocationCtrl', LocationCtrl);
  //injecting $rootScope so that it can listen for a newInfo broadcast from CardService and $timeout to be asynchronously called
  LocationCtrl.$inject = ['$scope', '$location', 'LocationFactory', '$rootScope', '$timeout'];

  function LocationCtrl($scope, $location, LocationFactory, $rootScope, $timeout){
    //always listening for when the user gets to the end of the list of businesses
    $rootScope.$on('newInfo', function(){
       $timeout(function() {
        console.log("BROADCAST HEARD");
          //recalls the function below 
          $scope.searchLocation();
      });
    })
  	$scope.search = {};

  	$scope.searchLocation = function() {
      // calls LocationFactory with the user inputted location which in turn calls 
      // the algorithm for new information and sends that to CardService's retrieve function
      LocationFactory.searchLocation($scope.search.location)
        .then(function(response){
          //upon response, reroute to the main page
          $location.path('/app/main');
        });
  	};
  }

})();

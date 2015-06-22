(function() {

  angular
    .module('dive')

    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope'];

  function MainCtrl($scope){
    .controller('MainCtrl', function($scope, CardService){
        $scope.cardSwipedLeft = function(){
            CardService.plusLeft();
            CardService.addCard();
        }
        $scope.cardSwipedRight = function(){
            CardService.plusRight();
            CardService.addCard();
        }
    })
  }

})();

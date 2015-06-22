(function() {

  angular
    .module('dive')

    .controller('CardCtrl', CardCtrl);

  MainCtrl.$inject = ['$scope'];

  function MainCtrl($scope){
    .controller('CardCtrl', function($scope, CardService){
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

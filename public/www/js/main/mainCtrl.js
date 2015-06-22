(function() {

  angular
    .module('dive')

    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'CardService'];

  function MainCtrl($scope, CardService){
        $scope.card = CardService.card;
        console.log($scope.card)
        $scope.cardSwipedLeft = function(){
            CardService.plusLeft();
            CardService.addCard();
        }
        $scope.cardSwipedRight = function(){
            CardService.plusRight();
            CardService.addCard();
        }
  }

})();

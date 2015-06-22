
(function() {

  angular
    .module('dive')

    .controller('CardService', CardService);

  CardService.$inject = ['$scope'];




.service('CardService', function(){
    this.addCard = function(){
        //Add a card to the ion-pane
    }
    this.plusLeft = function(){
        //Send information to algorithm (negative)
    }
    this.plusRight = function(){
        //Send information to algorithm (positive)
    }
})


})();
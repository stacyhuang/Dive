
(function() {

  angular
    .module('dive')

    .service('CardService', CardService);

     function CardService(){
        this.card = {image: "../../img/background.jpg", name: "Homepage"}
        this.addCard = function(){
            //Add a card to the ion-pane
        }
        this.plusLeft = function(){
            //Send information to algorithm (negative)
        }
        this.plusRight = function(){
            //Send information to algorithm (positive)
        }
    }


})();

(function() {

  angular
    .module('dive')

    .service('CardService', CardService);

     function CardService(){
        this.card = function(){
            return {image: "./img/background.jpg", name: "Homepage"}
        }
        this.addCard = function(){
            //Add a card to the ion-pane
            return {image: "./img/bar1.jpg", name: "Other Bar"}
        }
        this.plusLeft = function(){
            console.log('left')
            this.addCard();
            //Send information to algorithm (negative)
        }
        this.plusRight = function(){
            console.log('right')
            //Send information to algorithm (positive)
        }
    }


})();
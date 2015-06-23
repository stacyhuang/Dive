
(function() {

  angular
    .module('dive')

    .service('CardService', CardService);

     function CardService(){
        this.i = 0;
        this.info = [{image: "./img/bar1.jpg", name: "Other Bar", info: "This bar has lots of light, can't you see?"}, {image: "./img/bar1.jpg", name: "Bar three", info: "this bar looks very similar to the last one..."}]
        this.card = function(){
            return {image: "./img/background.jpg", name: "Homepage", info: "this is where it all begins, can you see the shingingwdoia aopufia aodsf s d"}
        }
        this.addCard = function(){
            //Add a card to the ion-pane
            return this.info[this.i]
        }
        this.plusLeft = function(){
            console.log('left')
            //Send information to algorithm (negative)
        }
        this.plusRight = function(){
            console.log('right')
            //Send information to algorithm (positive)
        }
    }


})();
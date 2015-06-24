
(function() {

  angular
    .module('dive')

    .service('CardService', CardService);

     // CardService.$inject = ['LocationFactory'];

     function CardService($rootScope){
        this.i = 0;
        this.info = [];
        this.retrieve = function(data){
            this.info = data;
            console.log(this.info[0])
            this.i = 0;
        }

        this.addCard = function(){
            if(this.info.length === 0){
                alert("Please specify a location")
            }else{
            if(this.i === 20){
                console.log($rootScope)
                $rootScope.$broadcast('newInfo');
               }
            else{
                return this.info[this.i]
            }
        }
            //Add a card to the ion-pane
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
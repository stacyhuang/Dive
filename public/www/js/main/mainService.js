(function() {

  angular
    .module('dive')

    .service('CardService', CardService);

    // With angular there can be many different $scopes but only one $rootScope for the entire app. 
    // It is also accessible anywhere in the app, hence no injection
    function CardService($rootScope){
      // counter to point at current/next yelp business
      this.i = 0;
      // holds set of 20 businesses at a time for the user to cycle through
      this.info = [];

      this.retrieve = function(data){
        // retrieves information from the algorithm to be set to info. This occurs in the beginning and
        // everytime the user gets to the end of the info array.
        this.info = data;
        // reset to 0 to cycle through new information
        this.i = 0;
      }

      // called to flip up a new card/info from this.info's array
      this.addCard = function(){
        // if info is empty there was no call to the algorithm, hence they didn't specify their location

        if(this.info.length === 0){
          alert("Please specify a location");
        }else{
          if(this.i === 20){
            // broadcasts to locationService file asking for new information from the algorithm
            $rootScope.$broadcast('newInfo');
           }
          else{
            // posts information
            return this.info[this.i];
          }
        }
      }

      /*
      this.saveCard = function(){
          //send information to mongodb to save place for tht specific user
      }
      */

      this.plusLeft = function(){
        console.log('left');
        //Send information to algorithm (negative)
      }

      this.plusRight = function(){
        console.log('right');
        //Send information to algorithm (positive)
      }
    }

})();
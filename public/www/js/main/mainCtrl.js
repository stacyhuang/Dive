(function() {

  angular
    .module('dive')

    .controller('MainCtrl', MainCtrl);


  MainCtrl.$inject = ['$scope', 'CardService', '$ionicGesture'];

  function MainCtrl($scope, CardService, $ionicGesture, TDCardDelegate){
        $scope.card = CardService.addCard();
        // $scope.onDragRight = function(){
        //   console.log("dragging right")
        // }
        // console.log($rootScope)
        $scope.onTapLeft = function(){
           CardService.plusLeft();
           $scope.card = CardService.addCard(CardService.i);
           CardService.i+=1;
           console.log(CardService.i)
        }
        $scope.onTapRight = function(){
           CardService.plusRight();
           $scope.card = CardService.addCard(CardService.i);
           CardService.i+=1;
        }
    // var element = angular.element(document.querySelector('#eventPlaceholder'));
    //         var events = [{
    //         event: 'dragup',
    //         },{
    //         event: 'dragdown',
    //         },{
    //         event: 'dragleft',
    //         },{
    //         event: 'dragright',
    //         }];
    // angular.forEach(events, function(obj){
    // var dragGesture = $ionicGesture.on(obj.event, function (event) {
    //     $scope.$apply(function () {
    //         $scope.lastEventCalled = obj.text;
    //         //console.log(obj.event)
    //         if (obj.event == 'dragleft'){                           
    //             CardService.plusLeft();
    //             $scope.card = CardService.addCard(CardService.i);
    //         }
    //         if (obj.event == 'dragright'){                          
    //             CardService.plusRight();
    //             $scope.card = CardService.addCard();
    //         }
    //     });

    //     }, element);
    // }); 
  }

})();

(function() {

  angular
    .module('dive')

    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'CardService', '$ionicGesture'];

  function MainCtrl($scope, CardService, $ionicGesture, TDCardDelegate){
        $scope.card = CardService.card();
    var element = angular.element(document.querySelector('#eventPlaceholder'));
            var events = [{
            event: 'dragup',
            },{
            event: 'dragdown',
            },{
            event: 'dragleft',
            },{
            event: 'dragright',
            }];
    angular.forEach(events, function(obj){
    var dragGesture = $ionicGesture.on(obj.event, function (event) {
        $scope.$apply(function () {
            $scope.lastEventCalled = obj.text;
            //console.log(obj.event)
            if (obj.event == 'dragleft'){                           
                CardService.plusLeft();
                $scope.card = CardService.addCard();
            }
            if (obj.event == 'dragright'){                          
                CardService.plusRight();
                $scope.card = CardService.addCard();
            }
        });

        }, element);
    }); 
  }

})();

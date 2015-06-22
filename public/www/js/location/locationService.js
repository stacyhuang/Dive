(function() {
  angular
    .module('dive')
    .factory('LocationFactory', function ($http, $location) {

      var searchLocation = function (location) {
        return $http({
          method: 'POST',
          url: '/location',
          data: location
        })
        .then(function (resp) {
          // Do something upon successful search
        });
      };

      return {
        searchLocation: searchLocation
      };
    });
})();

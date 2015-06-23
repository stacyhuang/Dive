(function() {
  angular
    .module('dive')
    .factory('LocationFactory', function ($http, $location) {

      var searchLocation = function (location) {
        return $http({
          method: 'POST',
          url: '/yelpapi/search/',
           data: {term: "Bar", location: location},
           content-type: application/json
        })
        .then(function (resp) {
          var file = JSON.parse(resp);
          console.log(file);
          // Do something upon successful search
        });
      };

      return {
        searchLocation: searchLocation
      };
    });
})();



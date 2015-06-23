(function() {
  angular
    .module('dive')
    .factory('LocationFactory', ['$http', '$location', 'CardService', function ($http, $location, CardService) {
      var searchLocation = function (location) {
        return $http({
          method: 'POST',
          url: '/yelpapi/search/',
          data: {term: "Bar", location: location},
          contentType: "application/json"
        })
        .then(function (resp) {
          // console.log(resp.data.businesses)
           CardService.retrieve(resp.data.businesses);
          // Do something upon successful search
        });
      };
      return {
        searchLocation: searchLocation
      };
    }]);
})();



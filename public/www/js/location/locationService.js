(function() {

  var serverUrl = "http://getdiveapp.herokuapp.com";
  // var serverUrl = "";
  
  angular
    .module('dive')
    // injecting CardService here so that it can pass the information retrieved from the algorithm and be rendered in user view
    .factory('LocationFactory', ['$http', '$location', 'CardService', function ($http, $location, CardService) {


      // sends post request to algorithm asking for suggestions in the form of yelp businesses
      var searchLocation = function (location) {
        var userId = window.localStorage['userId'];
        return $http({
          method: 'POST',
          url: serverUrl + '/yelpapi/search/',
          // specifying to only search for bars and only at the location they inputted
          data: {term: "Bar", location: location, userId: userId},
          contentType: "application/json"
        })
        .then(function (resp) {
          // upon return of data, send it to CardService's retrieve function in the form of an arrays
          CardService.retrieve(resp.data);
        });
      };
      return {
        searchLocation: searchLocation
      };
    }]);
})();

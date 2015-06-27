var algorithm = require('./database.js');
var Promise = require("bluebird");
//var yelp = require("./yelpdata.js").yelp;
Promise.promisifyAll(require("redis"));

var algorithm = require('../../server/engines/algorithmAPI.js');

// algorithm.rateRestaurant(75, "McDonalds", 0);
// db.smembers("75:Dislikes", function(err, data) {
//   console.log("ZZZZ");
//   console.log(data);
// });

//algorithm.importYelpRestaurants("San Francisco");

algorithm.setLocation(1, "San Francisco");
algorithm.setLocation(2, "San Francisco");
algorithm.setLocation(3, "San Francisco");

var suggestionsResponse;

var myFunction = function(arg) {
  suggestionsResponse = arg;
};



var myCallback = function(arg) {
  console.log("Suggestions");
  console.log(arg);
};

console.log(algorithm.getSuggestions(1, myCallback));
console.log(algorithm.getSuggestions(2, myCallback));
console.log(algorithm.getSuggestions(3, myCallback));

// setTimeout(function() {
//     console.log("GET SUGGESTIONS FUNCTION");
//     console.log(algorithm.getSuggestions(2, myCallback));
//   }, 10000);






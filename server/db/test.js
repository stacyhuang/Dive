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


algorithm.setStartIndex(1);
algorithm.setStartIndex(2);
algorithm.setLocation(1, "San Francisco");
algorithm.setLocation(2, "San Francisco");



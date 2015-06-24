var algorithm = require('./database.js');
var db = algorithm.client;

algorithm.rateRestaurant(75, "McDonalds", 0);
db.smembers("75:Dislikes", function(err, data) {
  console.log("ZZZZ");
  console.log(data);
});

algorithm.importYelpRestaurants();
// setTimeout(function() {
// db.hgetall("fog-harbor-fish-house-san-francisco-2", function(err, data) {
//   console.log("FOG HARBOR");
//   console.log(data.description);
// })}, 2000);

// setTimeout(function() {
//   db.scard("restaurants:San Francisco", function(err, data) {
//     console.log("RESTAURANT LIST LENGTH:  " + data);
//   })}, 3000);

algorithm.setStartIndex(1);
algorithm.setStartIndex(2);
algorithm.setLocation(1, "San Francisco");
algorithm.setLocation(2, "San Francisco");
console.log("SUGGESTIONS FOR 2");



setTimeout(function() {
    console.log(algorithm.getSuggestions(1));
  }, 5000);





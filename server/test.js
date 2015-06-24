var algorithm = require('./database.js');
var db = algorithm.client;

algorithm.rateRestaurant(75, "McDonalds", 0);
db.smembers("75:Dislikes", function(err, data) {
  console.log("ZZZZ");
  console.log(data);
});
console.log("SUGGESTIONS FOR 2");
console.log(algorithm.getSuggestions(2));
algorithm.importYelpRestaurants();
setTimeout(function() {
db.hgetall("fog-harbor-fish-house-san-francisco-2", function(err, data) {
  console.log("FOG HARBOR");
  console.log(data);
})}, 2000);



var db = require('database');

module.exports.rateRestaurant = function(user, restaurantID, feeling) {
  // - adds restaurant ID to users "like" or "dislike" list and
  //   returns 'success' or 'failure'
  var userList;

};

module.exports.getSuggestion = function(user) {
// - returns one restaurant record in json format;

};

module.exports.getSuggestions = function(user) {
 // - returns array of restaurant records in json format


};

module.exports.getUnreviewedRestaurants = function(user, location) {
//  - returns array of restaurant records in json format
  var userLikes = user + ":Likes";
  var userDislikes = user + ":Dislikes";
  db.sunionstore("userRated", userLikes, userDislikes);
  db.sdiffstore("unreviewedRestaurants", "restaurants:" + location, "userRated");
  db.smembers("unreviewedRestaurants", function(err, data) {
    return data;

  });
};

module.exports.keep = function(user, restaurantID) {
// - saves a restaurant ID to user's "keep" list;
  var keptList = user + ":Kept";
  db.sadd(keptList, restaurantID);
};

module.exports.getKept = function(user) {
// - returns array of restaurant records in json format
  var keptList = user + ":Kept";
  var record;
  var response = [];
  db.smembers("keptList", function(err, data) {
    for (var i = 0; i < data.length; i++) {
      db.hgetall(data[i], function(err, restRec) {
        record = {};
        for (var i = 0; i < restRec.length; i = i + 2) {
          record[restRec[i]] = restRec[i+1];
        }
        response.push(record);
        if (response.length === data.length) {
          return response;
        }
      });
    }
  });
};

module.exports.importYelpRestaurants = function(location, data) {
  // - takes raw yelp json data and places all the restaurant records
  //  in the database of restaurants
  var restaurantList = "restaurants:" + location;
  var description;
  for (var i = 0; i < data.businesses.length; i++) {
    restaurant = data.businesses[i];

    for (var j = 0; j < restaurant.categories.length; j++) {
      description = description + restaurant.categories[j][0];
      if (j !=== restaurant.categories.length - 1) {
        description = description + ", ";
      }
    }

    db.hmset(restaurant.id, {
      name: restaurant.name,
      id: restaurant.id,
      image: restaurant.image_url,
      description: description});
    });  

    db.sadd(restaurantList, restaurant.id);
  }
};
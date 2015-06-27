var redis = require('redis');
var Promise = require("bluebird");
Promise.promisifyAll(require("redis"));

var Engine = require('../../server/engines/engine.js');
var database = require('../../server/db/database.js');

var db = database.client;
var engine = new Engine(db);


var importYelpRestaurants = function(location, cb) {
  // - takes raw yelp json data and places all the restaurant records
  //  in the database of restaurants

  var yelp = require("yelp").createClient({
    consumer_key: "KjdDsNphOnZeY8w3YxJVcw", 
    consumer_secret: "6itM-P0nsf2qYvPpQCfnU6BABd0",
    token: "KyiFVSincgrzSHOBtHWA2KzGrakhBj5G",
    token_secret: "tc5_Rdwu8XqNb2fhM7TC7YDRkoI"
  });

  var queryName = "restaurant";
  var queryLocation = location;
  var firstloop = true;
  for (offset = 0; offset < 500; offset=offset+20) {
    yelp.search({term: queryName, location: queryLocation, sort: 0, offset: offset }, function(error, data) {
   //   console.log(data);
      var restaurantList = "restaurants:" + queryLocation;
      var description = "";
      for (var i = 0; i < data.businesses.length; i++) {
        restaurant = data.businesses[i];
//        console.log(restaurant.id);
        for (var j = 0; j < restaurant.categories.length; j++) {
          description = description + restaurant.categories[j][0];
          if (j !== restaurant.categories.length - 1) {
            description = description + ", ";
          }
        }      
        db.hmset(restaurant.id, {
          'name': restaurant.name,
          'id': restaurant.id,
          'image': restaurant.image_url,
          'description': description
        });

        db.sadd(restaurantList, restaurant.id);

      }
      if (firstloop) {
        firstloop = false;
        cb(true);
      }
    });
  }   
};


module.exports.rateRestaurant = function(user, restaurantID, feeling) {
  // - adds restaurant ID to users "like" or "dislike" list and
  //   returns 'success' or 'failure'
  if (feeling === 0) {
    engine.dislikes.add(user, restaurantID);
  }
  else
  {
    engine.likes.add(user, restaurantID);
  }
  engine.similars.update(user);
};

module.exports.setLocation = function(userID, location) {
 // - returns array of restaurant records in json format
  db.set(userID + ":Location", location);
};

module.exports.getSuggestions = function(userID, cb) {
 // - returns array of restaurant records in json format

  db.get(userID + ":Location", function(err, location) {

    var innerfunc = function() {
      var restaurantList = "restaurants:" + location;
      var likesList = userID + ":Likes";
      var dislikesList = userID + ":Dislikes";
      var results = [];

      engine.suggestions.update(userID, function(suggestions) {

        var limit = Math.min(20, suggestions.length);
        for (var i = 0; i < limit; i++) {
          results.push(suggestions[i]);
        }

        db.sunionstore("ratedList", likesList, dislikesList);

        db.smembers(restaurantList, function(err, data) {
          // console.log("RESTAURANT LIST");
          // console.log(data);

          db.smembers("ratedList", function(err, ratedList) {
            var index = 0;
            while ((results.length < 20) && (index < data.length)) {
              console.log(data[index]);
              if (ratedList.indexOf(data[index]) === -1 && results.indexOf(data[index]) === -1) {
                console.log(userID + ":StartIndex:  " + index);
                db.incr(userID + ":StartIndex");
                results.push(data[index]);
              }
              index = index+1;
            }
            var results2 = [];
            for (var i = 0; i < results.length; i++) {
              db.hgetall(results[i], function(err, data) {
                results2.push(data);
                if (results2.length == 20) {
                  cb(results2);
                }
              });
            }
          });
        });
      });
    };

    db.exists("restaurants:" + location, function(err, doesExist) {
      if (!doesExist) {
        importYelpRestaurants(location, innerfunc);
      }
      else
      {
        innerfunc();
      }

    });
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



// setTimeout(function() {
// db.hgetall("fog-harbor-fish-house-san-francisco-2", function(err, data) {
//   console.log("FOG HARBOR");
//   console.log(data.description);
// })}, 2000);

// setTimeout(function() {
//   db.scard("restaurants:San Francisco", function(err, data) {
//     console.log("RESTAURANT LIST LENGTH:  " + data);
//   })}, 3000);

var raterLikes = engine.likes;
var raterDislikes = engine.dislikes;
var similars = engine.similars;
var suggestions = engine.suggestions;


// setTimeout(function() {
//   db.smembers("restaurants:San Francisco", function(err, data) {
//     console.log("INSIDE LLOP");
//     for (var i = 0; i < 10; i++) {
//       module.exports.rateRestaurant(1, data[i]);
//     }
//     for (var j = 5; j < 15; j++) {
//       module.exports.rateRestaurant(2, data[j]);
//     }
//     for (var k = 8; k < 17; k++) {
//       module.exports.rateRestaurant(3, data[k]);
//     }


//   });}, 5000);

// setTimeout(function() {
//  similars.update(1);
//  similars.update(2);
// }, 10000);

//raterLikes.itemsByUser(2);

// raterLikes.usersByItem("vwx");
// db.smembers("1:Likes", function(err, data) {
//   console.log("MEMBERS OF 1: " + data);
// });


// setTimeout(function() { suggestions.update(1); }, 100);
// setTimeout(function() { suggestions.update(2); }, 100);

 // suggestions.update(2, myCallback);
 // suggestions.update(3, myCallback);
 // suggestions.update(4, myCallback);

//suggestions.update(2);

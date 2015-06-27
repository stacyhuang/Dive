var redis = require('redis');
var Promise = require("bluebird");
Promise.promisifyAll(require("redis"));

var Engine = require('../../server/engines/engine.js');
var database = require('../../server/db/database.js');

var db = database.client;
var engine = new Engine(db);


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
};

module.exports.setLocation = function(userID, location) {
 // - returns array of restaurant records in json format
  db.set(userID + ":Location", location);
};

module.exports.setStartIndex = function(userID) {
  var start = userID + ":StartIndex";
  db.get(start, function(err, index) {
    if (index === null) {
      db.set(start, 0);
    }
    else
    {
      db.incr(start);
    }
  });
};

module.exports.getSuggestions = function(userID, cb) {
 // - returns array of restaurant records in json format

  db.get(userID + ":Location", function(err, location) {
    var restaurantList = "restaurants:" + location;
    var likesList = userID + ":Likes";
    var dislikesList = userID + ":Dislikes";
    var results = [];

    db.sunionstore("ratedList", likesList, dislikesList);
    db.smembers(restaurantList, function(err, data) {
      // console.log("RESTAURANT LIST");
      // console.log(data);
      db.smembers("ratedList", function(err, ratedList) {
        db.get(userID + ":StartIndex", function(err, index) {
          index = Number(index);
          console.log("INDEX:" + index);
          while ((results.length < 20) && (index < data.length)) {
//            console.log(data[index]);
            if (ratedList.indexOf(data[index]) === -1) {
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
  });
};


// module.exports.getUnreviewedRestaurants = function(userID, location) {
// //  - returns array of restaurant records in json format
//   var userLikes = userID + ":Likes";
//   var userDislikes = userID + ":Dislikes";
//   db.sunionstore("userRated", userLikes, userDislikes);
//   db.sdiffstore("unreviewedRestaurants", "restaurants:" + location, "userRated");
//   db.smembers("unreviewedRestaurants", function(err, data) {
//     return data;

//   });
// };

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


module.exports.importYelpRestaurants = function(location) {
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
  for (var offset = 0; offset < 500; offset=offset+20) {
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
    });
  }   
};


setTimeout(function() {
db.hgetall("fog-harbor-fish-house-san-francisco-2", function(err, data) {
  console.log("FOG HARBOR");
  console.log(data.description);
})}, 2000);

setTimeout(function() {
  db.scard("restaurants:San Francisco", function(err, data) {
    console.log("RESTAURANT LIST LENGTH:  " + data);
  })}, 3000);

var raterLikes = engine.likes;
var raterDislikes = engine.dislikes;
var similars = engine.similars;
var suggestions = engine.suggestions;

// raterLikes.add(2, "abc");
// raterLikes.add(2, "def");
// raterLikes.add(2, "ghi");
// raterLikes.add(2, "jkl");
// raterDislikes.add(2, "mno");
// raterLikes.add(2, "pqr");
// raterLikes.add(2, "stu");
// raterLikes.add(2, "vwx");
// raterLikes.add(2, "yz");


// raterLikes.add(1, "abc");
// raterLikes.add(1, "def");
// raterLikes.add(1, "ghi");
// raterLikes.add(1, "jkl");
// raterDislikes.add(1, "mno");
// raterLikes.add(1, "pqr");
// raterLikes.add(1, "stu");
// raterLikes.add(1, "vwx");
// raterLikes.add(1, "yz");


// raterDislikes.add(1, "1 2 3");
// raterDislikes.add(1, "4 5 6");
// raterDislikes.add(1, "7 8 9");
// raterDislikes.add(1, "10 11 12");
// raterDislikes.add(1, "13 14 15");
// raterDislikes.add(1, "16 17 18");
// raterDislikes.add(1, "19 20 21");
// raterDislikes.add(1, "22 23 24");
// raterDislikes.add(1, "25 26 27");
// raterDislikes.add(1, "28 29 30");


// raterLikes.add(2, "def");
// raterLikes.add(2, "ghi");
// raterLikes.add(2, "jkl");
// raterLikes.add(2, "mno");
// raterLikes.add(2, "pqr");
// raterLikes.add(2, "stu");


// raterDislikes.add(2, "1 2 3");
// raterDislikes.add(2, "4 5 6");
// raterDislikes.add(2, "7 8 9");
// raterDislikes.add(2, "10 11 12");
// raterDislikes.add(2, "13 14 15");
// raterDislikes.add(2, "16 17 18");
// raterDislikes.add(2, "19 20 21");
// raterDislikes.add(2, "22 23 24");
// raterDislikes.add(2, "25 26 27");
// raterDislikes.add(2, "28 29 30");

// raterLikes.add(3, "ghi");
// raterLikes.add(3, "jkl");
// raterLikes.add(3, "mno");
// raterLikes.add(3, "pqr");
// raterLikes.add(3, "vwx");


// raterDislikes.add(3, "1 2 3");
// raterDislikes.add(3, "4 5 6");
// raterDislikes.add(3, "7 8 9");
// raterDislikes.add(3, "10 11 12");
// raterDislikes.add(3, "13 14 15");
// raterDislikes.add(3, "16 17 18");
// raterDislikes.add(3, "19 20 21");
// raterDislikes.add(3, "22 23 24");
// raterDislikes.add(3, "25 26 27");
// raterDislikes.add(3, "28 29 30");

// raterLikes.add(4, "jkl");
// raterLikes.add(4, "mno");
// raterLikes.add(4, "pqr");
// raterLikes.add(4, "yz");


// raterDislikes.add(4, "1 2 3");
// raterDislikes.add(4, "4 5 6");
// raterDislikes.add(4, "7 8 9");
// raterDislikes.add(4, "10 11 12");
// raterDislikes.add(4, "13 14 15");
// raterDislikes.add(4, "16 17 18");
// raterDislikes.add(4, "19 20 21");
// raterDislikes.add(4, "22 23 24");
// raterDislikes.add(4, "25 26 27");
// raterDislikes.add(4, "28 29 30");

setTimeout(function() {
  db.smembers("restaurants:San Francisco", function(err, data) {
    console.log("INSIDE LLOP");
    for (var i = 0; i < 10; i++) {
      raterLikes.add(1, data[i]);
    }
    for (var j = 5; j < 15; j++) {
      raterLikes.add(2, data[j]);
    }


  });}, 5000);

setTimeout(function() {
//  similars.update(1);
  similars.update(2);
}, 10000);


//db.sadd("1:Likes", "helo");

//raterLikes.itemsByUser(2);

raterLikes.usersByItem("vwx");
db.smembers("1:Likes", function(err, data) {
  console.log("MEMBERS OF 1: " + data);
});


// setTimeout(function() { suggestions.update(1); }, 100);
// setTimeout(function() { suggestions.update(2); }, 100);

 // suggestions.update(2, myCallback);
 // suggestions.update(3, myCallback);
 // suggestions.update(4, myCallback);

//suggestions.update(2);
var suggestionsResponse;

var myFunction = function(arg) {
  suggestionsResponse = arg;
};



var myCallback = function(arg) {
  console.log("Suggestions");
  console.log(arg);
};



// setTimeout(function() {
//     console.log("GET SUGGESTIONS FUNCTION");
//     console.log(module.exports.getSuggestions(2, myCallback));
//   }, 10000);


db.zscore("1:Similars", "2", function(err, data) {
    console.log("ZSCORE:  " + data);
});





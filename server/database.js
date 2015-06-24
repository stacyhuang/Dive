var redis = require('redis');
var Promise = require("bluebird");
var yelp = require("./yelpdata.js").yelp;
Promise.promisifyAll(require("redis"));

// var db = redis.createClient...
// db.getAsync(key).then()


// By default, redis.createClient() will use 127.0.0.1 and 6379 as the hostname and port respectively. 
//var client = redis.createClient(port, host);

console.log("process.env.REDISTOGO_URL: ", process.env)
if (process.env.REDISTOGO_URL) {
    // TODO: redistogo connection
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    console.log('rtg:', rtg);

    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
}

module.exports.client = client;
client.on('connect', function() {
    console.log('connected');
});

client.flushdb();


var location = yelp.region.center.latitude + "-" + yelp.region.center.longitude;

var restaurantList = "restaurants:" + location;


for (var i = 0; i < yelp.businesses.length; i++) {
  restaurant = yelp.businesses[i];
  client.hmset(restaurant.id, {
    name: restaurant.name,
    url: restaurant.mobile_url
  });  

 client.sadd(restaurantList, restaurant.id);
 if (i < 5 ) {
    client.sadd("testList", restaurant.id);
 }
}


client.hgetall('hall-of-flame-burgers-san-francisco', function(err, object) {
  console.log(object);
});

client.sinterstore(restaurantList, restaurantList, "testList");

var Rater = function(db, kind) {
  this.db = db;
  this.kind = kind;
};

Rater.prototype.add = function(userID, restaurantID, done) {
  var userSentimentList = userID + ":" + this.kind;
  var restaurantSentimentList = restaurantID + ":" + this.kind;
  this.db.sadd(userSentimentList, restaurantID);
  this.db.sadd(restaurantSentimentList, userID);
};

Rater.prototype.remove = function(userID, restaurantID, done) {
  var userSentimentList = userID + ":" + this.kind;
  var restaurantSentimentList = restaurantID + ":" + this.kind;
  this.db.srem(userSentimentList, restaurantID);
  this.db.srem(restaurantSentimentList, userID);
};

Rater.prototype.itemsByUser = function(userID, done) {
  var userSentimentList = userID + ":" + this.kind;
  this.db.smembers(userSentimentList, function(err, reply) {
//    console.log(reply);
  });  
};

Rater.prototype.usersByItem = function(restaurantID, done) {
  var restaurantSentimentList = restaurantID + ":" + this.kind;
  this.db.smembers(restaurantSentimentList, function(err, reply) {
    console.log("USERS BY ITEM " + reply);
  });
};


// Find union of users likes and dislikes
// Find all users who have rated anything on that userList
// compute list of similarity index for each user found and create new list

var Similars = function(db) {
  this.db = db;
  this.similars = ""; 
};

Similars.prototype.byUser = function(userID) {
  // var userSimilarsList = userID + ":Similars";
  // this.db.smembers(userSimilarsList);  
};

Similars.prototype.update = function(userID) {
  var userLikes = userID + ":Likes";
  var userDislikes = userID + ":Dislikes";

  var otherUserList = [];
  var otherUserScore = [];

  this.db.smembersAsync(userLikes).then(function(restaurantArray) {
    console.log("DOES THIS ASYNC FUNCTION WORK");
    console.log(restaurantArray);
  }).catch(function(e) {

  });

  this.db.sunionstore("userRated", userLikes, userDislikes);
  var that = this;
  this.db.smembers("userRated", function(err, restaurantArray) {
    for (var i = 0; i < restaurantArray.length; i++) {
      //WILL THIS THROW ERROR BECAUSE COMPARISONMEMBERS NOT DEFINED?
      var john = restaurantArray[i];
      // that.db.smembers(restaurantArray[i]+":Likes", function(err, answer) {
      //   console.log(answer);
      // });

      that.db.sunionstore("comparisonMembers", "comparisonMembers", restaurantArray[i] + ":Likes");
      that.db.sunionstore("comparisonMembers", "comparisonMembers", restaurantArray[i] + ":Dislikes");
    }
//    that.db.srem("comparisonMembers", userID);
    for (i = 0; i < 10000000; i++) {
        j = 1;

    }
    that.db.smembers("comparisonMembers", function(err, compMembersArray) {
      var comparisonIndex;
      var commonLikes;
      var commonDislikes;
      var conflicts1;
      var conflicts2;      
      var otherUserLikes;
      var otherUserDislikes;

      var commonLikesArr = [];
      var commonDislikesArr = [];
      var conflicts1Arr = [];
      var conflicts2Arr = [];
      var allRatedRestaurantsArr = [];


      for (i = 0; i < compMembersArray.length; i++) {

        console.log(compMembersArray.length);
        otherUserLikes = compMembersArray[i] + ":Likes";
        otherUserDislikes = compMembersArray[i] + ":Dislikes";

        otherUserList.push(compMembersArray[i]); 
        console.log(otherUserList);       
        //these are temporary lists, need to clear them somehow
  
        that.db.sinterstore("commonLikes", userLikes, otherUserLikes);
        that.db.sinterstore("commonDislikes", userDislikes, otherUserDislikes);
        that.db.sinterstore("conflicts1", userLikes, otherUserDislikes);
        that.db.sinterstore("conflicts2", userDislikes, otherUserLikes);
        that.db.sunionstore("allRatedRestaurants", userLikes, otherUserLikes,
                        userDislikes, otherUserDislikes);

        that.db.scard("commonLikes", function(err, commonLikesCount) {
          commonLikesArr.push(commonLikesCount);
        });

        that.db.scard("commonDislikes", function(err, commonDislikesCount) {
          commonDislikesArr.push(commonDislikesCount);
        });

        that.db.scard("conflicts1", function(err, conflicts1Count) {
          conflicts1Arr.push(conflicts1Count);
        });

        that.db.scard("conflicts2", function(err, conflicts2Count) {
          conflicts2Arr.push(conflicts2Count);
        });

        that.db.scard("allRatedRestaurants", function(err, allRatedRestaurantsCount) {
          allRatedRestaurantsArr.push(allRatedRestaurantsCount);
          if (compMembersArray.length === commonLikesArr.length) {
            for (var k = 0; k < commonLikesArr.length; k++) {
              console.log(" commonLikesCount:  " + commonLikesArr[k] +
                  " commonDislikes:  " + commonDislikesArr[k] +
                  " conflicts1:  " + conflicts1Arr[k] +
                  " conflicts2:  " + conflicts2Arr[k] +
                  " allRatedRestaurants:  " + allRatedRestaurantsArr[k]);
              comparisonIndex = (Number(commonLikesArr[k]) + Number(commonDislikesArr[k]) -
                       Number(conflicts1Arr[k]) - Number(conflicts2Arr[k])) / Number(allRatedRestaurantsArr[k]);
              console.log("COMPARISON INDEX:  " + comparisonIndex);
              that.db.zadd(userID + ":Similars", comparisonIndex, compMembersArray[k]);
              that.db.zrange(userID + ":Similars", 0, -1, function(err, answer) {
                console.log("DO WE GET HERE");
                console.log(answer);
              });
            }
          }
        });
      }
    });
});
};


var Suggestions = function(db) {
  this.db = db;
};

Suggestions.prototype.forUser = function(userID) {
  var db = this.db;
  var suggestionList = userID + ":Suggestions";
  db.smembers(suggestionList, function(err, data) {
    return data;
  });
};


Suggestions.prototype.update = function(userID) {
//  GET USER'S UNRATED RESTAURANTS THAT
//  ARENT IN PAST SUGGESTIONS
//  FOR EACH RESTAURANT, CALCULATE PROBABILITY USER WILL LIKE IT
//  -- PUT IN USER1 SUGGESTIONS LIST
  var userLikes = userID + ":Likes";
  var userDislikes = userID + ":Dislikes";
  var db = this.db;

  db.sunionstoreAsync("userRatedRestaurants", userLikes, userDislikes).
  then(function () {
    return db.sdiffstoreAsync("potentialList", "allRestaurants", "userRatedRestaurants" );
  }).
  then(function () {
    return db.smembersAsync("potentialList");
  }).
  then(function (potentialList) {
    potentialList.forEach(function(rest) {
      var usersWhoLiked;
      db.smembersAsync(rest + ":Likes").
      then(function(usersWhoLiked) {
        db.smembersAsync(rest + ":Dislikes").
        then(function(usersWhoDisliked) {
          console.log("USERS WHO DISLIKED LENGTH A:  " + usersWhoDisliked.length);
          var numerator = 0;
          var finalScore;
          console.log("USERS WHO LIKED");
          console.log(usersWhoLiked); 
          var usersWhoLikedCount = usersWhoLiked.length;
          console.log("USERS WHO LIKED COUNT:  " + usersWhoLikedCount);
          var usersWhoDislikedCount = usersWhoDisliked.length;
          var counter = 0;
          usersWhoLiked.forEach(function(user) {
            counter++;
            db.zscore(userID + ":Similars", user, function(err, score) {
              console.log("LIKE SCORE");
              console.log(score);
              numerator = numerator + Number(score);
              if (counter === usersWhoLikedCount) { 
                counter = 0;
                console.log("USERS WHO DISLIKED LENGTH: " + usersWhoDislikedCount);
                usersWhoDisliked.forEach(function(user) {
                  console.log("JOHN");

                  counter++;
                  db.zscore(userID + ":Similars", user, function(err, score) {
                     console.log("DISLIKE SCORE");
                     console.log(score);
                     numerator = numerator - Number(score);
                     if (counter === usersWhoDislikedCount) {
                       finalScore = numerator/(usersWhoLiked.length + usersWhoDisliked.length);
                       db.zadd(userID + ":Suggestions", finalScore, rest);
                       db.zrange(userID + ":Suggestions", 0, -1, function(err, answer) {
                         console.log("SUGGESTIONS FOR " + userID);
                         console.log(answer);
                       });
                     }
                  });
                });
              }
            });
          });
        });
      });
    });
  });
};



var raterLikes = new Rater(client, "Likes");
var raterDislikes = new Rater(client, "Dislikes");
var similars = new Similars(client);
var suggestions = new Suggestions(client);

raterLikes.add(1, "abc");
raterLikes.add(1, "def");
raterLikes.add(1, "ghi");
raterLikes.add(1, "jkl");
raterLikes.add(1, "mno");
raterLikes.add(1, "vwx");


raterLikes.add(2, "def");
raterLikes.add(2, "ghi");
raterLikes.add(2, "jkl");
raterLikes.add(2, "mno");
raterLikes.add(2, "pqr");
raterLikes.add(2, "stu");
raterLikes.add(2, "yz");


raterLikes.add(4, "abc");

raterLikes.add(3, "abc");
raterLikes.add(3, "def");
raterLikes.add(3, "yz");


raterDislikes.add(1, "123");
raterDislikes.add(1, "456");
raterDislikes.add(1, "789");
raterDislikes.add(1, "101112");
raterDislikes.add(1, "131415");

raterDislikes.add(2, "abc");
raterDislikes.add(2, "123");
raterDislikes.add(2, "101112");
raterDislikes.add(2, "131415");






client.sadd("allRestaurants", "abc");
client.sadd("allRestaurants", "def");
client.sadd("allRestaurants", "ghi");
client.sadd("allRestaurants", "jkl");
client.sadd("allRestaurants", "mno");
client.sadd("allRestaurants", "vwx");


client.sadd("allRestaurants", "def");
client.sadd("allRestaurants", "ghi");
client.sadd("allRestaurants", "jkl");
client.sadd("allRestaurants", "mno");
client.sadd("allRestaurants", "pqr");
client.sadd("allRestaurants", "stu");
client.sadd("allRestaurants", "yz");


client.sadd("allRestaurants", "123");
client.sadd("allRestaurants", "456");
client.sadd("allRestaurants", "789");
client.sadd("allRestaurants", "101112");
client.sadd("allRestaurants", "131415");




//client.sadd("1:Likes", "helo");

//raterLikes.itemsByUser(2);

raterLikes.usersByItem("vwx");
similars.update(1);

// setTimeout(function() { suggestions.update(1); }, 100);
// setTimeout(function() { suggestions.update(2); }, 100);

suggestions.update(1);
suggestions.update(2);

client.zscore("1:Similars", "2", function(err, data) {
    console.log("ZSCORE:  " + data);
});

     

module.exports.rateRestaurant = function(user, restaurantID, feeling) {
  // - adds restaurant ID to users "like" or "dislike" list and
  //   returns 'success' or 'failure'
  if (feeling === 0) {
    raterDislikes.add(user, restaurantID);
  }
  else
  {
    raterLikes.add(user, restaurantID);
  }
};

module.exports.setLocation = function(userID, location) {
 // - returns array of restaurant records in json format
  client.set(userID + ":Location", location);
};

module.exports.setStartIndex = function(userID) {
  var start = userID + ":StartIndex";
  client.get(start, function(err, index) {
    if (index === null) {
      client.set(start, 0)
    }
    else
    {
      client.incr(start);
    }
  })

};

module.exports.getSuggestions = function(userID) {
 // - returns array of restaurant records in json format

  client.get(userID + ":Location", function(err, location) {
    var restaurantList = "restaurants:" + location;
    var likesList = userID + ":Likes";
    var dislikesList = userID + ":Dislikes";
    client.sunionstore("ratedList", likesList, dislikesList);
    client.smembers(restaurantList, function(err, data) {
      // console.log(data);
      client.smembers("ratedList", function(err, ratedList) {
        var results = [];
        client.get(userID + ":StartIndex", function(err, index) {
          // console.log("INDEX :" + index);
          // console.log("DO WE G HEERE");
//          console.log(data);
          index = Number(index);
          while ((results.length < 20) && (index < data.length)) {
            if (ratedList.indexOf(data[index]) === -1) {
              client.incr(userID + ":StartIndex");
              results.push(data[index]);
              index = index+1;
            }
          }
//          console.log(results);
          return results;
        });
      })
    });
  });
};

module.exports.getUnreviewedRestaurants = function(userID, location) {
//  - returns array of restaurant records in json format
  var userLikes = userID + ":Likes";
  var userDislikes = userID + ":Dislikes";
  client.sunionstore("userRated", userLikes, userDislikes);
  client.sdiffstore("unreviewedRestaurants", "restaurants:" + location, "userRated");
  client.smembers("unreviewedRestaurants", function(err, data) {
    return data;

  });
};

module.exports.keep = function(user, restaurantID) {
// - saves a restaurant ID to user's "keep" list;
  var keptList = user + ":Kept";
  client.sadd(keptList, restaurantID);
};

module.exports.getKept = function(user) {
// - returns array of restaurant records in json format
  var keptList = user + ":Kept";
  var record;
  var response = [];
  client.smembers("keptList", function(err, data) {
    for (var i = 0; i < data.length; i++) {
      client.hgetall(data[i], function(err, restRec) {
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
  var queryLocation = "San Francisco";
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
        client.hmset(restaurant.id, {
          'name': restaurant.name,
          'id': restaurant.id,
          'image': restaurant.image_url,
          'description': description
        });

        client.sadd(restaurantList, restaurant.id);

      }
    });
  }   
};


//module.exports.client;

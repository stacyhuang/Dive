var redis = require('redis');
var Promise = require("bluebird");
Promise.promisifyAll(require("redis"));

var Similars = function(db) {
  this.db = db;
  this.similars = ""; 
};

Similars.prototype.byUser = function(userID) {
  // var userSimilarsList = userID + ":Similars";
  // db.smembers(userSimilarsList);  
};

Similars.prototype.update = function(userID) {
  var userLikes = userID + ":Likes";
  var userDislikes = userID + ":Dislikes";
  var db = this.db;

  db.sunionAsync(userLikes, userDislikes).
  then(function(userRatedRests) {
    db.del("comparisonMembers");
    for (var i = 0; i < userRatedRests.length; i++) {
      db.sunionstore("comparisonMembers", "comparisonMembers", userRatedRests[i] + ":Likes");
      db.sunionstore("comparisonMembers", "comparisonMembers", userRatedRests[i] + ":Dislikes");
    }
    db.srem("comparisonMembers", userID); 
    db.smembers("comparisonMembers", function(err, compMembersArray) {
      compMembersArray.forEach(function(member) {
        var commonLikes;
        var commonDislikes;
        var conflicts1;
        var conflicts2;
        var allRatedRestaurants;

        var otherUserLikes = member + ":Likes";
        var otherUserDislikes = member + ":Dislikes";
        db.sinterAsync(userLikes, otherUserLikes).
        then(function(answer) {
          commonLikes = answer;
          return db.sinterAsync(userDislikes, otherUserDislikes);
        }).
        then(function(answer) {
          commonDislikes = answer;
          return db.sinterAsync(userLikes, otherUserDislikes);
        }).
        then(function(answer) {
          conflicts1 = answer;
          return db.sinterAsync(userDislikes, otherUserLikes);
        }).
        then(function(answer) {
          conflicts2 = answer;
          return db.sunionAsync(userLikes, otherUserLikes,
                                userDislikes, otherUserDislikes);
        }).
        then(function(answer) {
          allRatedRestaurants = answer;
          var comparisonIndex = (commonLikes.length + commonDislikes.length -
                                 conflicts1.length - conflicts2.length) /
                                 allRatedRestaurants.length;

          console.log("COMPARISON INDEX " + userID + ":  " + member + "  " + comparisonIndex);

          db.zadd(userID + ":Similars", comparisonIndex, member);
          db.zadd(member + ":Similars", comparisonIndex, userID);

        });
      });
    });
  });
};

module.exports = Similars;


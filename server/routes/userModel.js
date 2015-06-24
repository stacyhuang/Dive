var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

UserSchema.methods.checkPasswords = function(enteredPassword){
  // creates a promise object with a promise property and resolve and reject method
  var deferred = Q.defer();
  var savedPassword = this.password;
  // bcrypt takes in the data to compare, the data to be compared to, and a callback
  bcrypy.compare(enteredPassword, savedPassword, function(error, result){
    if(error){
      deferred.reject(error);
    }else{
      deferred.resolve(result);
    }
  });
  return defer.promise;
};

module.exports = mongoose.model('users', UserSchema);
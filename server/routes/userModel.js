var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    // number of rounds to process the data for
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
  bcrypt.compare(enteredPassword, savedPassword, function(error, result){
    if(error){
      deferred.reject(error);
    }else{
      deferred.resolve(result);
    }
  });
  return deferred.promise;
};

UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')){
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt){
    if(error){
      return next(error);
    }

    // hash the password with the generated salt
    bcrypt.hash(user.password, salt, null, function(error, hash){
      if(error){
        return next(error);
      }

      // override the password provided by user with the hashed password
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
})

module.exports = mongoose.model('users', UserSchema);
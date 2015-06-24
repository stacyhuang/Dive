var jwt  = require('jwt-simple');

module.exports = {
  decode: function(req, res, next){
    var token = req.headers['x-access-token'];
    var user;

    // send forbidden if a token is not provided in the header
    if(!token){
      return res.send(403);
    }

    try{
      // decode token and attach user to the request for use inside the controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    }
    catch(error){
      return next(error);
    }
  }
};

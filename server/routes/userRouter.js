var userController = require('./userController.js');

module.exports = function (app) {

  app.route('/login')
    .post(userController.login);

  app.route('/signup')
    .post(userController.signup);

  app.route('signedin')
  	.get(userController.checkAuth);

};
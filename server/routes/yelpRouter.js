var yelpController = require('./yelpController.js')

module.exports = function(app){
    app.route('/search/*')
        .post(yelpController.searchQuery)

    app.route('/business/')
        .post(yelpController.businessQuery)
}

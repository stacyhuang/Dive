var express = require('express');
var app = express();

require('./middleware')(app, express);
module.exports = app;

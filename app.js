var express = require('express');
var app = require('./server/server.js');
// view engine setup


app.listen(process.env.PORT || 4000)
console.log('Server now listening on port ' + 4000);

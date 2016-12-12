var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var passport = require('passport');
var session      = require('express-session');
var cors = require('cors');
var util = require('util');
var promise = require('bluebird');
var formidable = require('formidable');
var AWS = require('aws-sdk');
var fs = require('fs-extra');
var S3FS = require('s3fs');

var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);

var app = express();
var connection = "postgres://Bloot@localhost/auth";

var db = pgp(connection);
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('bucket-name',{
    accessKeyId: "AKIAJYA4PMXAFYPALNNA",
    secretAccessKey: "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"
});
require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client')));
app.use(cors());
app.use(flash());
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const MONGO_URL =process.env.MONGODB_URI || 'mongodb://localhost/bankdb';
//const MONGO_URL ='mongodb://localhost/bankdb';
var mongoose = require('mongoose');
mongoose.connect(MONGO_URL,err =>{
console.log(err||`Mongodb connected to ${MONGO_URL}`)
});

var routes = require('./routes/index');
var users = require('./routes/users');
var transactions = require('./routes/transactions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.use('/', routes);
app.use('/users', users);
app.use('/transactions',transactions)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

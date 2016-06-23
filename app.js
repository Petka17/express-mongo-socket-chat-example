var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('lib/log')(module);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// init port
app.set('port', process.env.PORT || config.get('port'));

http.createServer(app).listen(app.get('port'), function() {
  log.info('Express listening on port %s in %s mode', app.get('port'), app.get('env'));
});


// Middleware
app.use(function(req, res, next) {
  if (req.url == '/') {
    res.end("Hello");
  } else {
    next()
  }
});

app.use(function(req, res, next) {
  if (req.url == '/secret') {
    next(new Error('access forbidden'));
  } else {
    next()
  }
});

app.use(function(req, res, next) {
  if (req.url == '/test') {
    res.end("Test");
  } else {
    next()
  }
});

app.use(function(req, res) {
  res.status(404).send("Page not found")
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

// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var routes = require('./routes/index');
// var users = require('./routes/users');
//
//
//

//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', routes);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

//
// module.exports = app;

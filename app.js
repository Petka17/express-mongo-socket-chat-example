// Base modules
var express = require('express');
var http    = require('http');
var path    = require('path');

// Middleware function generators
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');

// Custom modules
var config = require('config');
var log    = require('lib/log')(module);

// Init express app
var app = express();

// Set port
app.set('port', process.env.PORT || config.get('port'));

// View engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup base middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// Root path render
app.get('/', function(req, res, next) {
    res.render('index', {});
})

// Error path
app.get('/error', function(req, res, next) {
    var err = new Error('Server Error');
    err.status = 500;
    next(err);
})

// Serve static asserts
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Init error handler
app.use(function (err, req, res, next) {
    log.error(err.message)

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

// Start server
http.createServer(app).listen(app.get('port'), function () {
    log.info('Express listening on port %s in %s mode', app.get('port'), app.get('env'));
});

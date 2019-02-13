// Base modules
var express = require('express');
var http    = require('http');
var path    = require('path');

// Middleware function generators
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var expressSession = require('express-session');

// Custome middleware
var loadUser = require('middleware/loadUser');

// Session store
var MongoStore = require('connect-mongo')(expressSession);

// Custom modules
var config   = require('config');
var log      = require('lib/log')(module);
var mongoose = require('lib/mongoose');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session (after cookieParser)
app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Set user
app.use(loadUser);

// Set routes
app.use(require('./routes'));

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

// Create server
var server = http.createServer(app);

// Listen http requests
server.listen(app.get('port'), function () {
    log.info('Express listening on port %s in %s mode', app.get('port'), app.get('env'));
});

//  Setup Socket.io
var io = require('socket.io')(server);
io.set('origins', 'localhost:*');

io.sockets.on('connection', function(socket) {
    socket.on('message', function(text, callback) {
        socket.broadcast.emit('message', text);
        callback();
    });
});

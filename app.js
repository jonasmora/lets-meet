
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , maps = require('./routes/maps')
  , sockets = require('./routes/sockets')
  , http = require('http')
  , path = require('path');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/letsMeet', {safe: true});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.create_map);
app.get('/maps/:id', routes.index);
app.get('/partials/maps/show', routes.show_map);

// Maps JSON API
app.get('/api/maps/:id', maps.show);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Socket.io Communication
io.sockets.on('connection', function(socket) {
  sockets(io, socket);
});

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , markers = require('./routes/markers')
  , socket = require('./routes/socket')
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

app.get('/', routes.index);

app.get('/api/markers', markers.list);
app.post('/api/markers', markers.create);
app.put('/api/markers/:id', markers.update);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Socket.io Communication

io.sockets.on('connection', socket);

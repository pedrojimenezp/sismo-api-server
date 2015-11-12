/// <reference path="../../typings/node/node.d.ts"/>

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _swig = require('swig');

var _swig2 = _interopRequireDefault(_swig);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

var _routesApiRoutes = require('./routes/ApiRoutes');

var _routesApiRoutes2 = _interopRequireDefault(_routesApiRoutes);

//import MQTTClient from './MQTTClient';

var app = (0, _express2['default'])();
var multipartMiddleware = (0, _connectMultiparty2['default'])();
/*
  USING SOME MIDDLEWARES
*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use((0, _morgan2['default'])('dev'));
app.use(_bodyParser2['default'].json({ limit: '50mb' }));
app.use(_bodyParser2['default'].urlencoded({ limit: '50mb', extended: false }));
app.use(multipartMiddleware);
app.use((0, _cookieParser2['default'])());
app.use("/static", _express2['default']['static'](_path2['default'].join(__dirname, '/../../client/static')));
//app.use('/static', express.static('public'));

/*
  USING SWIG ENGINE
*/
app.engine('html', _swig2['default'].renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../../client/views');

app.set('view cache', false);
_swig2['default'].setDefaults({ cache: false });

/*
  CONNECT TO RETHINKDB
*/

var options = {
  host: 'localhost',
  port: 28015,
  db: 'sismo'
};

//let mongodbUrl = 'mongodb://localhost:27017/sismo';
var mongodbUrl = 'mongodb://admin:1q2w3e4r@ds031098.mongolab.com:31098/sismo-api';

_mongodb2['default'].connect(mongodbUrl, function (error, db) {
  if (error) {
    console.log(error);
    console.log('Error trying to connect to SisMo database rethinkdb on ' + mongodbUrl);
  } else {
    (function () {
      console.log("Connected correctly to server.");

      new _routesApiRoutes2['default'](app, db);

      var port = process.env.PORT || '4000';
      app.set('port', port);

      var server = _http2['default'].createServer(app);

      server.listen(port);
      server.on('error', function (error) {
        console.error(error);
      });

      server.on('listening', function () {
        console.log('HTTP server is listening in localhost:' + port);
      });
    })();
  }
});
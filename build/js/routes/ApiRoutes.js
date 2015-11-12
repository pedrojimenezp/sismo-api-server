"use strict";
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

//const router = express.Router();

var _controllersUsersController = require('../controllers/UsersController');

var _controllersUsersController2 = _interopRequireDefault(_controllersUsersController);

var _controllersMotosController = require('../controllers/MotosController');

var _controllersMotosController2 = _interopRequireDefault(_controllersMotosController);

var _controllersTokensController = require('../controllers/TokensController');

var _controllersTokensController2 = _interopRequireDefault(_controllersTokensController);

var _helpersMiddlewares = require('../helpers/Middlewares');

var _helpersMiddlewares2 = _interopRequireDefault(_helpersMiddlewares);

var _configConfig = require('../config/config');

var _configConfig2 = _interopRequireDefault(_configConfig);

var _helpersHttpResponses = require('../helpers/httpResponses');

var httpResponses = _interopRequireWildcard(_helpersHttpResponses);

var _helpersHelpers = require('../helpers/helpers');

var helpers = _interopRequireWildcard(_helpersHelpers);

var _constantsAPIConstants = require('../constants/APIConstants');

var _constantsAPIConstants2 = _interopRequireDefault(_constantsAPIConstants);

var ApiRoutes = (function () {
  function ApiRoutes(app, db) {
    _classCallCheck(this, ApiRoutes);

    this.app = app;
    this.middlewares = new _helpersMiddlewares2['default'](db);
    this.usersControllers = new _controllersUsersController2['default'](db);
    this.motosControllers = new _controllersMotosController2['default'](db);
    this.tokensControllers = new _controllersTokensController2['default'](db);
    this.makeRoutes();
  }

  _createClass(ApiRoutes, [{
    key: 'makeRoutes',
    value: function makeRoutes() {
      var _this = this;

      // Middleware that allows cross domain
      this.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

      this.app.get('/', function (req, res) {
        res.render("index.html");
      });

      this.app.post('/api/v1/login', function (req, res) {
        return _this.usersControllers.login(req, res);
      });

      this.app.post('/api/v1/users', function (req, res) {
        return _this.usersControllers.insertUser(req, res);
      });

      this.app.get('/api/v1/users', function (req, res) {
        return _this.usersControllers.getUsers(req, res);
      });

      this.app.get('/api/v1/users/:username', function (req, res) {
        return _this.usersControllers.getUserByUsername(req, res);
      });

      this.app.post('/api/v1/motos', function (req, res) {
        return _this.motosControllers.insertMoto(req, res);
      });

      this.app.get('/api/v1/motos', function (req, res) {
        return _this.motosControllers.getMotos(req, res);
      });

      this.app.get('/api/v1/motos/:mac', function (req, res) {
        return _this.motosControllers.getMotoByMac(req, res);
      });

      this.app.put('/api/v1/motos/:mac', function (req, res) {
        return _this.motosControllers.updateMotoByMac(req, res);
      });

      this.app['delete']('/api/v1/motos/:mac', function (req, res) {
        return _this.motosControllers.deleteMotoByMac(req, res);
      });

      this.app.get('/api/v1/motos/:mac/image', function (req, res) {
        return _this.motosControllers.getMotoImageByMac(req, res);
      });

      this.app.put('/api/v1/motos/:mac/status', function (req, res) {
        return _this.motosControllers.updateMotoStatusByMac(req, res);
      });

      this.app.get('/api/v1/verification/access-token', function (req, res) {
        return _this.tokensControllers.verifyAccessToken(req, res);
      });
    }
  }]);

  return ApiRoutes;
})();

exports['default'] = ApiRoutes;
module.exports = exports['default'];
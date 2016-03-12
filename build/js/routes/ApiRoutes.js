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

var _controllersViewsController = require('../controllers/ViewsController');

var _controllersViewsController2 = _interopRequireDefault(_controllersViewsController);

var _controllersTheftsController = require('../controllers/TheftsController');

var _controllersTheftsController2 = _interopRequireDefault(_controllersTheftsController);

var _controllersRecoveriesController = require('../controllers/RecoveriesController');

var _controllersRecoveriesController2 = _interopRequireDefault(_controllersRecoveriesController);

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

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var ApiRoutes = (function () {
  function ApiRoutes(app, db) {
    _classCallCheck(this, ApiRoutes);

    this.app = app;
    this.middlewares = new _helpersMiddlewares2['default'](db);
    this.usersController = new _controllersUsersController2['default'](db);
    this.motosController = new _controllersMotosController2['default'](db);
    this.theftsController = new _controllersTheftsController2['default'](db);
    this.recoveriesController = new _controllersRecoveriesController2['default'](db);
    this.viewsController = new _controllersViewsController2['default'](db);
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
        return _this.viewsController.renderIndex(req, res);
      });
      this.app.get('/thefts', function (req, res) {
        return _this.viewsController.renderThefts(req, res);
      });
      this.app.get('/recoveries', function (req, res) {
        return _this.viewsController.renderRecoveries(req, res);
      });

      this.app.get('/error', function (req, res) {
        return _this.viewsController.renderError(req, res);
      });

      this.app.get('/:username/motos', function (req, res) {
        return _this.viewsController.renderUserMotos(req, res);
      });

      this.app.get('/:username/motos/:mac/update', function (req, res) {
        return _this.viewsController.renderUpdateUserMotos(req, res);
      });

      this.app.get('/:username/thefts', function (req, res) {
        return _this.viewsController.renderUserThefts(req, res);
      });

      this.app.get('/:username/recoveries', function (req, res) {
        return _this.viewsController.renderUserRecoveries(req, res);
      });

      this.app.get('/:username/recoveries/add', function (req, res) {
        return _this.viewsController.renderAddUserRecoveries(req, res);
      });

      this.app.get('/signin', function (req, res) {
        return _this.viewsController.renderSignin(req, res);
      });

      this.app.get('/signup', function (req, res) {
        return _this.viewsController.renderSignup(req, res);
      });

      this.app.get('/logout', function (req, res) {
        req.session.destroy();
        res.cookie("isLogged", false);
        res.redirect('/');
      });

      this.app.post('/api/v1/login', function (req, res) {
        return _this.usersController.login(req, res);
      });
      this.app.post('/api/v1/login2', function (req, res) {
        return _this.usersController.login2(req, res);
      });

      this.app.post('/api/v1/users', function (req, res) {
        return _this.usersController.insertUser(req, res);
      });

      this.app.get('/api/v1/users', function (req, res) {
        return _this.usersController.getUsers(req, res);
      });

      this.app.get('/api/v1/users/:username', function (req, res) {
        return _this.usersController.getUserByUsername(req, res);
      });

      this.app.post('/api/v1/motos', function (req, res) {
        return _this.motosController.insertMoto(req, res);
      });

      this.app.get('/api/v1/motos', function (req, res) {
        return _this.motosController.getMotos(req, res);
      });

      this.app.get('/api/v1/motos/:mac', function (req, res) {
        return _this.motosController.getMotoByMac(req, res);
      });

      this.app.put('/api/v1/motos/:mac', function (req, res) {
        return _this.motosController.updateMotoByMac(req, res);
      });

      this.app['delete']('/api/v1/motos/:mac', function (req, res) {
        return _this.motosController.deleteMotoByMac(req, res);
      });

      this.app.get('/api/v1/motos/:mac/image', function (req, res) {
        return _this.motosController.getMotoImageByMac(req, res);
      });

      this.app.get('/api/v1/motos/:mac/status', function (req, res) {
        return _this.motosController.getMotoStatusByMac(req, res);
      });

      this.app.put('/api/v1/motos/:mac/status', function (req, res) {
        return _this.motosController.updateMotoStatusByMac(req, res);
      });

      this.app.get('/api/v1/thefts', function (req, res) {
        return _this.theftsController.getThefts(req, res);
      });

      this.app.post('/api/v1/thefts/:motoMac', function (req, res) {
        return _this.theftsController.insertTheftsByMac(req, res);
      });

      this.app['delete']('/api/v1/thefts/:id', function (req, res) {
        return _this.theftsController.deleteTheftById(req, res);
      });

      this.app.post('/api/v1/recoveries', function (req, res) {
        return _this.recoveriesController.insertRecovery(req, res);
      });

      this.app['delete']('/api/v1/recoveries/:id', function (req, res) {
        return _this.recoveriesController.deleteRecoveryById(req, res);
      });
    }
  }]);

  return ApiRoutes;
})();

exports['default'] = ApiRoutes;
module.exports = exports['default'];
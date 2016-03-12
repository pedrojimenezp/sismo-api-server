'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constantsAPIConstants = require('../constants/APIConstants');

var _constantsAPIConstants2 = _interopRequireDefault(_constantsAPIConstants);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _configConfig = require('../config/config');

var _configConfig2 = _interopRequireDefault(_configConfig);

var _modelsUsersModel = require('../models/UsersModel');

var usersModel = _interopRequireWildcard(_modelsUsersModel);

var _modelsMotosModel = require('../models/MotosModel');

var motosModel = _interopRequireWildcard(_modelsMotosModel);

var _helpersHttpResponses = require('../helpers/httpResponses');

var httpResponses = _interopRequireWildcard(_helpersHttpResponses);

var _helpersHelpers = require('../helpers/helpers');

var helpers = _interopRequireWildcard(_helpersHelpers);

var ViewsControllers = function ViewsControllers(db) {
  _classCallCheck(this, ViewsControllers);

  this.db = db;
};

exports['default'] = ViewsControllers;
module.exports = exports['default'];
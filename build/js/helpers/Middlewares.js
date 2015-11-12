'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _modelsUsersModel = require('../models/UsersModel');

var usersModel = _interopRequireWildcard(_modelsUsersModel);

var _modelsMotosModel = require('../models/MotosModel');

var motosModel = _interopRequireWildcard(_modelsMotosModel);

var _modelsTokensModel = require('../models/TokensModel');

var tokensModel = _interopRequireWildcard(_modelsTokensModel);

var _httpResponses = require('./httpResponses');

var httpResponses = _interopRequireWildcard(_httpResponses);

var Middlewares = (function () {
  function Middlewares(db) {
    _classCallCheck(this, Middlewares);

    this.db = db;
  }

  _createClass(Middlewares, [{
    key: 'tokenHasExpired',
    value: function tokenHasExpired(req, res, next) {
      console.log("-> callling function hasExpired in Middlewares");
      var self = this;
      var response = undefined;
      var errorResponse = undefined;
      var accessToken = undefined;
      if (req.headers['access-token']) {
        accessToken = req.headers['access-token'];
      } else if (req.headers.authorization) {
        var authorization = req.headers.authorization.split(" ");
        if (authorization[0] === "Bearer") {
          if (authorization[1] !== "") {
            accessToken = authorization[1];
          } else {
            errorResponse = {
              error: "Wrong format of Bearer authorization method",
              description: "To use the Bearer authorization you must to send a access token in the authorization header with Bearer flag"
            };
          }
        } else {
          errorResponse = {
            error: "Wrong format of Bearer authorization method",
            description: "To use the Bearer authorization you must to send a access token in the authorization header with Bearer flag"
          };
        }
      } else {
        errorResponse = {
          error: "Access token not provided",
          description: "You must to send an access token in the header of the request, it can be sent with the access-token header or can be sent with the authorization header as a Bearer token with this form (Bearer your-access-token)"
        };
      }
      if (errorResponse) {
        httpResponses.badRequest(res, errorResponse);
      } else {
        (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
          var filter, result;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                filter = { accessToken: accessToken };
                context$3$0.next = 3;
                return tokensModel.findTokenByFilter(self.db, filter);

              case 3:
                result = context$3$0.sent;

                if (result) {
                  if (!tokensModel.tokenHasExpired(result)) {
                    req.user = {
                      id: result.userId,
                      scopes: result.scopes,
                      accessToken: accessToken
                    };
                    next();
                  } else {
                    errorResponse = {
                      error: "Access token has expired",
                      description: "The token you sent has expired"
                    };
                    httpResponses.unauthorized(res, errorResponse);
                  }
                } else {
                  errorResponse = {
                    error: "Invalid access token",
                    description: "The token you sent is not a valid token"
                  };
                  httpResponses.unauthorized(res, errorResponse);
                }

              case 5:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          httpResponses.internalServerError(res, error);
        });
      }
    }
  }, {
    key: 'canAccessToThisScope',
    value: function canAccessToThisScope(req, res, scope, next) {
      console.log("-> callling function canAccessToThisScope in Middlewares");
      var self = this;
      var errorResponse = undefined;
      if (req.user.scopes.indexOf(scope) >= 0) {
        (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
          var filter, result;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                filter = { _id: req.user.id };
                context$3$0.next = 3;
                return usersModel.findUserByFilter(self.db, filter);

              case 3:
                result = context$3$0.sent;

                req.user.username = result.account.username;
                next();

              case 6:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          httpResponses.internalServerError(res, error);
        });
      } else {
        errorResponse = {
          error: "Can access to this  resource",
          description: "The token you sent is valid but hasn't the permits to access to this resource"
        };
        httpResponses.unauthorized(res, errorResponse);
      }
    }
  }]);

  return Middlewares;
})();

exports['default'] = Middlewares;
module.exports = exports['default'];
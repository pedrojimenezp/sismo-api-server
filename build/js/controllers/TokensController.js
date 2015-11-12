'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _modelsTokensModel = require('../models/TokensModel');

var tokensModel = _interopRequireWildcard(_modelsTokensModel);

var _helpersHttpResponses = require('../helpers/httpResponses');

var httpResponses = _interopRequireWildcard(_helpersHttpResponses);

var _helpersHelpers = require('../helpers/helpers');

var helpers = _interopRequireWildcard(_helpersHelpers);

var TokensControllers = (function () {
  function TokensControllers(db) {
    _classCallCheck(this, TokensControllers);

    this.db = db;
  }

  _createClass(TokensControllers, [{
    key: 'verifyAccessToken',
    value: function verifyAccessToken(req, res) {
      console.log("-> callling function verifyAccessToken in TokensControllers");
      var self = this;
      var response = undefined;
      var accessToken = undefined;
      var errorResponse = undefined;
      if (req.query["access-token"]) {
        accessToken = req.query["access-token"];
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

                response = {
                  code: 200,
                  type: _constantsAPIConstants2['default'].OK,
                  verification: {
                    result: _constantsAPIConstants2['default'].TOKEN_VALID,
                    description: "The access token is valid"
                  }
                };
                if (result) {
                  if (tokensModel.tokenHasExpired(result)) {
                    response.verification.result = _constantsAPIConstants2['default'].TOKEN_EXPIRED;
                    response.verification.description = "The access token has expired";
                  }
                } else {
                  response.verification.result = _constantsAPIConstants2['default'].TOKEN_INVALID;
                  response.verification.description = "The access token is invalid";
                }
                res.status(response.code).send(response);

              case 7:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          httpResponses.internalServerError(res, error);
        });
      } else {
        errorResponse = {
          error: "Access token not provided",
          description: "You have to send a access-token in the url"
        };
        httpResponses.badRequest(res, "You must to send a access-token in the header or in the url");
      }
    }
  }, {
    key: 'createToken',
    value: function createToken(req, res) {
      console.log("-> callling function createToken in TokensController");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      if (req.headers.authorization && req.headers.authorization !== "") {
        var authorization = req.headers.authorization.split(" ");
        if (authorization[0] === "Basic") {
          if (authorization[1] !== "") {
            var usernameAndPassword = new Buffer(authorization[1], 'base64').toString();
            var array = usernameAndPassword.split(":");
            if (array.length === 2) {
              (function () {
                var username = array[0];
                var password = array[1];
                (0, _co2['default'])(regeneratorRuntime.mark(function callee$3$0() {
                  var user, userId, scopes, token, tokenInserted;
                  return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                      case 0:
                        context$4$0.next = 2;
                        return usersModel.findUserByFilter(self.db, { 'account.username': username });

                      case 2:
                        user = context$4$0.sent;

                        console.log(user);

                        if (!(!helpers.isEmpty(user) && user.account.password === password)) {
                          context$4$0.next = 18;
                          break;
                        }

                        userId = user._id;
                        scopes = ["motos", "profile", "thefts", "recoveries", "logs", "tokens"];
                        token = tokensModel.createTokenObject(userId, scopes);
                        context$4$0.next = 10;
                        return tokensModel.insertToken(self.db, token);

                      case 10:
                        result = context$4$0.sent;
                        tokenInserted = result.ops[0];

                        delete tokenInserted.userId;
                        delete tokenInserted._id;
                        response = {
                          tokens: tokenInserted
                        };
                        httpResponses.Ok(res, response);
                        context$4$0.next = 20;
                        break;

                      case 18:
                        errorResponse = {
                          error: "Wrong username or password",
                          description: "The username or password you sent are incorrects"
                        };
                        httpResponses.unauthorized(res, errorResponse);

                      case 20:
                      case 'end':
                        return context$4$0.stop();
                    }
                  }, callee$3$0, this);
                }))['catch'](function (error) {
                  httpResponses.internalServerError(res, error);
                });
              })();
            } else {
              errorResponse = {
                error: "Wrong username:password codification",
                description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
              };
              httpResponses.badRequest(res, errorResponse);
            }
          } else {
            errorResponse = {
              error: "Wrong format of Basic authentication method",
              description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
            };
            httpResponses.badRequest(res, errorResponse);
          }
        } else {
          errorResponse = {
            type: "Wrong format of Basic authentication method",
            description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
          };
          httpResponses.badRequest(res, errorResponse);
        }
      } else {
        (function () {
          var accessToken = "";
          var refreshToken = "";
          if (req.headers["access-token"] && req.headers["refresh-token"]) {
            accessToken = req.headers["access-token"];
            refreshToken = req.headers["refresh-token"];
          } else if (req.query["access-token"] && req.query["refresh-token"]) {
            accessToken = req.query["access-token"];
            refreshToken = req.query["refresh-token"];
          } else if (req.body["access-token"] && req.body["refresh-token"]) {
            accessToken = req.body["access-token"];
            refreshToken = req.body["refresh-token"];
          }
          if (accessToken !== "" && refreshToken !== "") {
            (0, _co2['default'])(regeneratorRuntime.mark(function callee$3$0() {
              var filter, token, tokenInserted;
              return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                while (1) switch (context$4$0.prev = context$4$0.next) {
                  case 0:
                    filter = {
                      accessToken: accessToken
                    };
                    context$4$0.next = 3;
                    return tokensModel.findTokenByFilter(self.db, filter);

                  case 3:
                    result = context$4$0.sent;

                    if (!result) {
                      context$4$0.next = 26;
                      break;
                    }

                    if (!(result.refreshToken === refreshToken)) {
                      context$4$0.next = 22;
                      break;
                    }

                    token = tokensModel.createTokenObject(result.userId, result.scopes);
                    context$4$0.next = 9;
                    return tokensModel.insertToken(self.db, token);

                  case 9:
                    result = context$4$0.sent;
                    tokenInserted = result.ops[0];

                    delete tokenInserted.userId;
                    delete tokenInserted._id;
                    filter.refreshToken = refreshToken;
                    console.log(filter);
                    context$4$0.next = 17;
                    return tokensModel.deleteTokenByFilter(self.db, filter);

                  case 17:
                    result = context$4$0.sent;

                    response = {
                      tokens: tokenInserted
                    };
                    httpResponses.Ok(res, response);
                    context$4$0.next = 24;
                    break;

                  case 22:
                    errorResponse = {
                      error: "Invalid refresh-token",
                      description: "The refresh token you sent in the header is invalid"
                    };
                    httpResponses.unauthorized(res, errorResponse);

                  case 24:
                    context$4$0.next = 28;
                    break;

                  case 26:
                    errorResponse = {
                      error: "Invalid access token",
                      description: "The access token you sent in the header is invalid"
                    };
                    httpResponses.unauthorized(res, errorResponse);

                  case 28:
                  case 'end':
                    return context$4$0.stop();
                }
              }, callee$3$0, this);
            }))['catch'](function (error) {
              httpResponses.internalServerError(res, error);
            });
          } else {
            errorResponse = {
              error: "Invalid authentication method",
              description: "To get an access-token you must to use one of 2 authentication methods. Method 1: use the Basic authentication  it means send username:password with base64 codification in the authentication header with Basic flag. Method 2: send an access-token and refresh-token in headers with the same names"
            };
            httpResponses.badRequest(res, errorResponse);
          }
        })();
      }
    }
  }, {
    key: 'deleteToken',
    value: function deleteToken(req, res) {
      console.log("-> callling function deleteToken in TokensController");
      var self = this;
      var response = undefined;
      var result = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var filter;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              filter = { accessToken: req.accessToken };
              context$3$0.next = 3;
              return tokensModel.deleteTokenByFilter(self.db, filter);

            case 3:
              result = context$3$0.sent;

              response = {
                code: 200,
                result: 'Token deleted'
              };
              res.status(response.code).send(response);

            case 6:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }))['catch'](function (error) {
        httpResponses.internalServerError(res);
      });
    }
  }, {
    key: 'createMQTTToken',
    value: function createMQTTToken(req, res) {
      var username = req.user.account.username;
      var filter = {
        userId: req.user.id
      };
      var self = this;
      var response = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var userMotos, subscribeChannelsAllowed, publishChannelsAllowed, length, i, MQTTToken;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return motos.getMotosByFilter(self.connection, filter);

            case 2:
              userMotos = context$3$0.sent;
              subscribeChannelsAllowed = ['/apps/users/' + username];
              publishChannelsAllowed = ['/apps/users/' + username];
              length = userMotos.length;

              for (i = 0; i < length; i++) {
                publishChannelsAllowed.push('/motos/' + userMotos[i].mac);
                subscribeChannelsAllowed.push('/motos/' + userMotos[i].mac);
              }
              MQTTToken = jwt.sign({
                username: '' + username,
                clientType: 'app',
                subscribeChannelsAllowed: subscribeChannelsAllowed,
                publishChannelsAllowed: publishChannelsAllowed
              }, 'secret');

              response = {
                code: 201,
                MQTTToken: MQTTToken
              };
              res.status(response.code).send(response);

            case 10:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }))['catch'](function (error) {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    }
  }]);

  return TokensControllers;
})();

exports['default'] = TokensControllers;
module.exports = exports['default'];
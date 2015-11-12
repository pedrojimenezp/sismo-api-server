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

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var UsersController = (function () {
  function UsersController(db) {
    _classCallCheck(this, UsersController);

    this.db = db;
  }

  _createClass(UsersController, [{
    key: 'getUsers',
    value: function getUsers(req, res) {
      console.log("-> callling function getAllUsers in UsersControllers");
      var self = this;
      var result = undefined;
      var response = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return usersModel.findUsers(self.db);

            case 2:
              result = context$3$0.sent;

              response = {
                code: 200,
                users: result
              };
              res.status(response.code).send(response);

            case 5:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }))['catch'](function (error) {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    }
  }, {
    key: 'getUserByUsername',
    value: function getUserByUsername(req, res) {
      console.log("-> calling function getUserByUsername in UsersControllers");
      var self = this;
      var response = undefined;
      var errorResponse = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var user, userMotos;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return usersModel.findUserByFilter(self.db, { 'account.username': req.params.username });

            case 2:
              user = context$3$0.sent;

              if (!user) {
                context$3$0.next = 13;
                break;
              }

              if (user.account) {
                delete user.account.password;
              }
              context$3$0.next = 7;
              return motosModel.findMotosByFilter(self.db, { userId: user._id });

            case 7:
              userMotos = context$3$0.sent;

              user.motos = userMotos;
              response = {
                code: 200,
                status: 'Ok',
                result: {
                  user: user
                }
              };
              res.status(response.code).send(response);
              context$3$0.next = 15;
              break;

            case 13:
              errorResponse = {
                error: "Username not found",
                description: "The username you sent in the url doesn't exist in our db"
              };
              httpResponses.notFound(res, "Username not found");

            case 15:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }))['catch'](function (error) {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    }
  }, {
    key: 'insertUser',
    value: function insertUser(req, res) {
      console.log("-> callling function insertUser in UsersControllers");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      if (req.body.username && req.body.password) {
        (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
          var usernameAlreadyExist, user, userInserted;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                context$3$0.next = 2;
                return usersModel.usernameAlreadyExist(self.db, req.body.username);

              case 2:
                usernameAlreadyExist = context$3$0.sent;

                if (!usernameAlreadyExist) {
                  context$3$0.next = 8;
                  break;
                }

                errorResponse = {
                  type: "Username already exist",
                  description: "The the username you want to register is already registered in our db, you have to send another"
                };
                httpResponses.conflict(res, errorResponse);
                context$3$0.next = 18;
                break;

              case 8:
                user = {
                  account: {
                    username: req.body.username,
                    password: req.body.password
                  }
                };
                context$3$0.next = 11;
                return usersModel.insertUser(self.db, user);

              case 11:
                result = context$3$0.sent;
                userInserted = result.ops[0];

                delete userInserted.account.password;
                userInserted.profile = {};
                userInserted.motos = [];
                response = {
                  code: 201,
                  user: userInserted
                };
                res.status(response.code).send(response);

              case 18:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          console.log(error);
          httpResponses.internalServerError(res);
        });
      } else {
        httpResponses.badRequest(res, "You have to pass a username and password");
      }
    }
  }, {
    key: 'login',
    value: function login(req, res) {
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
                  var user;
                  return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                      case 0:
                        context$4$0.next = 2;
                        return usersModel.findUserByFilter(self.db, { 'account.username': username });

                      case 2:
                        user = context$4$0.sent;

                        console.log(user);
                        if (user && user.account.password === password) {
                          delete user.account.password;
                          response = {
                            user: user
                          };
                          httpResponses.Ok(res, response);
                        } else {
                          errorResponse = {
                            error: "Wrong username or password",
                            description: "The username or password you sent are incorrects"
                          };
                          httpResponses.unauthorized(res, errorResponse);
                        }

                      case 5:
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
        errorResponse = {
          error: "Invalid authentication method",
          description: "To login you must to use the Basic authentication it means send username:password with base64 codification in the authentication header with Basic flag"
        };
        httpResponses.badRequest(res, errorResponse);
      }
    }
  }]);

  return UsersController;
})();

exports['default'] = UsersController;
module.exports = exports['default'];
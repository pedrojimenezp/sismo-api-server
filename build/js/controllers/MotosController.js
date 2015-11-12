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

var MotosController = (function () {
  function MotosController(db) {
    _classCallCheck(this, MotosController);

    this.db = db;
  }

  _createClass(MotosController, [{
    key: 'insertMoto',
    value: function insertMoto(req, res) {
      console.log("-> callling function addUserMoto in MotosController");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      if (req.body.userId && req.body.mac) {
        (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
          var filter, moto, newMoto, motoInserted;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                filter = {
                  mac: req.body.mac
                };
                context$3$0.next = 3;
                return motosModel.findMotoByFilter(self.db, filter);

              case 3:
                moto = context$3$0.sent;

                if (moto) {
                  context$3$0.next = 23;
                  break;
                }

                newMoto = {
                  userId: req.body.userId,
                  mac: req.body.mac,
                  brand: "",
                  line: "",
                  model: 0,
                  plate: "",
                  color: "",
                  cylinderCapacity: 0,
                  image: "",
                  imageEncodeType: "",
                  status: {
                    monitoring: "off",
                    safetyLock: "unlocked",
                    electricalFlow: "unlocked"
                  }
                };

                if (req.body.brand) {
                  newMoto.brand = req.body.brand;
                }
                if (req.body.line) {
                  newMoto.line = req.body.line;
                }
                if (req.body.model) {
                  newMoto.model = req.body.model;
                }
                if (req.body.plate) {
                  newMoto.plate = req.body.plate;
                }
                if (req.body.color) {
                  newMoto.color = req.body.color;
                }
                if (req.body.cylinderCapacity) {
                  newMoto.cylinderCapacity = req.body.cylinderCapacity;
                }
                if (req.body.image) {
                  newMoto.image = req.body.image;
                }
                if (req.body.imageEncodeType) {
                  newMoto.imageEncodeType = req.body.imageEncodeType;
                }
                context$3$0.next = 16;
                return motosModel.insertMoto(self.db, newMoto);

              case 16:
                result = context$3$0.sent;
                motoInserted = result.ops[0];

                delete motoInserted.image;
                response = {
                  code: 201,
                  status: 'Created',
                  result: {
                    moto: motoInserted
                  }
                };
                res.status(response.code).send(response);
                context$3$0.next = 25;
                break;

              case 23:
                errorResponse = {
                  error: "Mac already exist",
                  description: "The the mac you want to register already registered, you have to send another"
                };
                httpResponses.conflict(res, errorResponse);

              case 25:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          httpResponses.internalServerError(res);
        });
      } else {
        errorResponse = {
          error: "Missing parameters",
          description: "You have to sent at least the userId and the mac associated to the moto in the body of the request"
        };
        httpResponses.badRequest(res, errorResponse);
      }
    }
  }, {
    key: 'getMotos',
    value: function getMotos(req, res) {
      console.log("-> callling function getAllMotos in MotosController");
      var self = this;
      var response = undefined;
      var result = undefined;
      var filter = {};
      if (req.query.userId) {
        filter.userId = req.query.userId;
      }
      if (req.query.mac) {
        filter.mac = req.query.mac;
      }
      if (req.query.brand) {
        filter.brand = req.query.brand;
      }
      if (req.query.line) {
        filter.line = req.query.line;
      }
      if (req.query.model) {
        filter.model = req.query.model;
      }
      if (req.query.plate) {
        filter.plate = req.query.plate;
      }
      if (req.query.color) {
        filter.color = req.query.color;
      }
      if (req.query.cylinderCapacity) {
        filter.cylinderCapacity = req.query.cylinderCapacity;
      }
      var projection = {};
      if (req.query.image == "no") {
        projection.image = 0;
      }
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var motos;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return motosModel.findMotosByFilter(self.db, filter, projection);

            case 2:
              motos = context$3$0.sent;

              response = {
                code: 200,
                status: 'Ok',
                result: {
                  motos: motos
                }
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
    key: 'getMotoByMac',
    value: function getMotoByMac(req, res) {
      console.log("-> callling function getMotoByMac in MotosController");
      var self = this;
      var response = undefined;
      var errorResponse = undefined;
      var filter = {
        mac: req.params.mac
      };
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var moto;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return motosModel.findMotoByFilter(self.db, filter);

            case 2:
              moto = context$3$0.sent;

              if (moto) {
                if (req.query.image == "no") {
                  delete moto.image;
                }
                response = {
                  code: 200,
                  status: 'Ok',
                  result: {
                    moto: moto
                  }
                };
                res.status(response.code).send(response);
              } else {
                errorResponse = {
                  error: "Mac not found",
                  description: "This mac doesn't exist"
                };
                httpResponses.notFound(res, errorResponse);
              }

            case 4:
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
    key: 'getMotoImageByMac',
    value: function getMotoImageByMac(req, res) {
      console.log("-> callling function getAnUserMotoImageByMac in MotosController");
      var self = this;
      var response = undefined;
      var errorResponse = undefined;
      var filter = {
        mac: req.params.mac
      };
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var moto, img;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return motosModel.findMotoByFilter(self.db, filter);

            case 2:
              moto = context$3$0.sent;

              if (moto) {
                img = new Buffer(moto.image, 'base64');

                res.writeHead(200, {
                  'Content-Type': "image/png",
                  'Content-Length': img.length,
                  'Content-Disposition': 'inline; filename="' + moto.mac + '"'
                });
                res.write(img);
                res.end();
              } else {
                errorResponse = {
                  error: "Mac not found",
                  description: "This mac doesn't exist"
                };
                httpResponses.notFound(res, errorResponse);
              }

            case 4:
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
    key: 'updateMotoByMac',
    value: function updateMotoByMac(req, res) {
      console.log("-> callling function updateUserMotoByMac in MotosController");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var filter, moto;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              filter = {
                mac: req.params.mac
              };
              context$3$0.next = 3;
              return motosModel.findMotoByFilter(self.db, filter);

            case 3:
              moto = context$3$0.sent;

              if (!moto) {
                context$3$0.next = 23;
                break;
              }

              if (req.body.mac) {
                moto.mac = req.body.mac;
              }
              if (req.body.brand) {
                moto.brand = req.body.brand;
              }
              if (req.body.line) {
                moto.line = req.body.line;
              }
              if (req.body.model) {
                moto.model = req.body.model;
              }
              if (req.body.plate) {
                moto.plate = req.body.plate;
              }
              if (req.body.color) {
                moto.color = req.body.color;
              }
              if (req.body.cylinderCapacity) {
                moto.cylinderCapacity = req.body.cylinderCapacity;
              }
              if (req.body.image) {
                moto.image = req.body.image;
              }
              if (req.body.imageEncodeType) {
                moto.imageEncodeType = req.body.imageEncodeType;
              }
              delete moto._id;
              delete moto.userId;
              context$3$0.next = 18;
              return motosModel.updateMotoByFilter(self.db, filter, moto);

            case 18:
              result = context$3$0.sent;

              response = {
                code: 200,
                status: "Ok"
              };
              res.status(response.code).send(response);
              context$3$0.next = 25;
              break;

            case 23:
              errorResponse = {
                error: "Mac not found",
                description: "This mac doesn't exist"
              };
              httpResponses.notFound(res, errorResponse);

            case 25:
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
    key: 'deleteMotoByMac',
    value: function deleteMotoByMac(req, res) {
      console.log("-> callling function deleteUserMotoByMac in MotosController");
      var self = this;
      var response = undefined;
      var errorResponse = undefined;
      var result = undefined;
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var filter, moto;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              filter = {
                mac: req.params.mac
              };
              context$3$0.next = 3;
              return motosModel.findMotoByFilter(self.db, filter);

            case 3:
              moto = context$3$0.sent;

              if (!moto) {
                context$3$0.next = 12;
                break;
              }

              context$3$0.next = 7;
              return motosModel.deleteMotoByFilter(self.db, filter);

            case 7:
              result = context$3$0.sent;

              response = {
                code: 200,
                status: 'Ok'
              };
              res.status(response.code).send(response);
              context$3$0.next = 14;
              break;

            case 12:
              errorResponse = {
                error: "Mac not found",
                description: "This mac doesn't exist"
              };
              httpResponses.notFound(res, errorResponse);

            case 14:
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
    key: 'updateMotoStatusByMac',
    value: function updateMotoStatusByMac(req, res) {
      console.log("-> callling function updateUserMotoMonitoringStatusByMac in MotosController");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      if (req.body.monitoringStatus && req.body.safetyLockStatus && req.body.electricalFlowStatus) {
        (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
          var filter, moto, dataToUpdate;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                filter = {
                  mac: req.params.mac
                };
                context$3$0.next = 3;
                return motosModel.findMotoByFilter(self.db, filter);

              case 3:
                moto = context$3$0.sent;

                if (!moto) {
                  context$3$0.next = 13;
                  break;
                }

                dataToUpdate = {
                  status: {
                    monitoring: req.body.monitoringStatus,
                    safetyLock: req.body.safetyLockStatus,
                    electricalFlow: req.body.electricalFlowStatus
                  }
                };
                context$3$0.next = 8;
                return motosModel.updateMotoByFilter(self.db, filter, dataToUpdate);

              case 8:
                result = context$3$0.sent;

                response = {
                  code: 200,
                  status: "Ok"
                };
                res.status(response.code).send(response);
                context$3$0.next = 15;
                break;

              case 13:
                errorResponse = {
                  error: "Mac not found",
                  description: "This mac doesn't exist"
                };
                httpResponses.notFound(res, errorResponse);

              case 15:
              case 'end':
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }))['catch'](function (error) {
          console.log(error);
          httpResponses.internalServerError(res);
        });
      } else {
        errorResponse = {
          error: "Missing parameters",
          description: "You have to sent the monitoringStatus, safetyLockStatus and the electricalFlowStatus of the moto in the body of the request"
        };
        httpResponses.badRequest(res, errorResponse);
      }
    }
  }]);

  return MotosController;
})();

exports['default'] = MotosController;
module.exports = exports['default'];
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

var _modelsNotificationsModel = require('../models/NotificationsModel');

var notificationsModel = _interopRequireWildcard(_modelsNotificationsModel);

var _helpersHttpResponses = require('../helpers/httpResponses');

var httpResponses = _interopRequireWildcard(_helpersHttpResponses);

var _helpersHelpers = require('../helpers/helpers');

var helpers = _interopRequireWildcard(_helpersHelpers);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var NotificationsController = (function () {
  function NotificationsController(db) {
    _classCallCheck(this, NotificationsController);

    this.db = db;
  }

  _createClass(NotificationsController, [{
    key: 'getNotifications',
    value: function getNotifications(req, res) {
      console.log("-> callling function getNotificationsByFilter in NotificationsControllers");
      var self = this;
      var result = undefined;
      var response = undefined;
      var filter = {};
      var limit = 10;

      if (req.query.userId) {
        filter["userId"] = req.query.userId;
      }

      if (req.query.limit) {
        limit = req.query.limit;;
      }

      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return notificationsModel.findNotificationsByFilter(self.db, filter, { date: 1 }, limit);

            case 2:
              result = context$3$0.sent;

              response = {
                code: 200,
                result: {
                  notifications: result
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
    key: 'insertNotification',
    value: function insertNotification(req, res) {
      console.log("-> callling function createNotification in NotificationsControllers");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      var notification = {};
      if (req.body.userId) {
        notification["userId"] = req.body.userId;
      }
      if (req.body.motoMac) {
        notification["motoMac"] = req.body.motoMac;
      }
      if (req.body.subject) {
        notification["subject"] = req.body.subject;
      }
      notification["date"] = Date.now();
      notification["status"] = "unread";

      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var notificationInserted;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return notificationsModel.insertNotification(self.db, notification);

            case 2:
              result = context$3$0.sent;
              notificationInserted = result.ops[0];

              response = {
                code: 201,
                notificationCreated: notificationInserted
              };
              res.status(response.code).send(response);

            case 6:
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
    key: 'updateNotificationStatusToRead',
    value: function updateNotificationStatusToRead(req, res) {
      console.log("-> callling function updateNotification in NotificationsControllers");
      var self = this;
      var response = undefined;
      var result = undefined;
      var errorResponse = undefined;
      var notification = {};
      (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              result = notificationsModel.updateNotification(self.db, { _id: req.params.notificationId }, { status: "read" });
              response = {
                code: 201,
                result: result
              };
              res.status(response.code).send(response);

            case 3:
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

  return NotificationsController;
})();

exports['default'] = NotificationsController;
module.exports = exports['default'];
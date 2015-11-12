'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertNotification = insertNotification;
exports.updateNotification = updateNotification;
exports.findNotificationById = findNotificationById;
exports.findNotificationsByFilter = findNotificationsByFilter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

/*
Notifications have this info

notifications = {
  id: ObjectId,
  userId: ObjectId,
  motoMac: String,
  subject: String,
  date: Date,
  status: String 
}
*/

function insertNotification(db, notification) {
  console.log("-> calling function insertNotification in NotificationsModel");
  return new Promise(function (resolve, reject) {
    if (db && notification) {
      var notificationsCollection = db.collection('notifications');
      notificationsCollection.insert(notification, function (error, result) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to db and notification as parameters"
      };
      reject(error);
    }
  });
}

function updateNotification(db, filter, dataToUpdate) {
  console.log("-> calling function updateNotification in NotificationsModel");
  return new Promise(function (resolve, reject) {
    if (db && filter && dataToUpdate) {
      var notificationsCollection = db.collection('notifications');
      notificationsCollection.update(filter, { $set: dataToUpdate }, function (error, result) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to db and notification as parameters"
      };
      reject(error);
    }
  });
}

function findNotificationById(db, id) {
  console.log("-> calling function getNotificationsByFilter in NotificationsModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var notificationsCollection = db.collection('notifications');
      notificationsCollection.findOne({ _id: id }, function (error, notification) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(notification);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to pass a db and an id as parameters"
      };
      reject(error);
    }
  });
}

function findNotificationsByFilter(db, filter, sort, limit) {
  console.log("-> calling function getNotificationsByFilter in NotificationsModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var notificationsCollection = db.collection('notifications');
      notificationsCollection.find(filter).sort(sort).limit(limit).toArray(function (error, notifications) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(notifications);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}
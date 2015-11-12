'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.usernameAlreadyExist = usernameAlreadyExist;
exports.findUsers = findUsers;
exports.insertUser = insertUser;
exports.updateUserByFilter = updateUserByFilter;
exports.findUserByFilter = findUserByFilter;
exports.findUsersByFilter = findUsersByFilter;

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

function usernameAlreadyExist(db, username) {
  console.log("-> calling function usernameAlreadyExist in UsersModel");
  return new Promise(function (resolve, reject) {
    var usersCollection = db.collection('users');
    usersCollection.findOne({ 'account.username': username }, function (error, result) {
      if (error) {
        reject({ error: 'Database error', description: error });
      } else {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}

function findUsers(db) {
  console.log("-> calling function findAllUsers in UsersModel");
  return new Promise(function (resolve, reject) {
    var usersCollection = db.collection('users');
    usersCollection.find({}, { "account.password": 0, _id: 0 }).toArray(function (error, docs) {
      if (error) {
        reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
      } else {
        resolve(docs);
      }
    });
  });
}

function insertUser(db, user) {
  console.log("-> calling function insertUser in UsersModel");
  return new Promise(function (resolve, reject) {
    if (db && user) {
      var usersCollection = db.collection('users');
      usersCollection.insertOne(user, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: "Missing parameters",
        description: "You have to pass a db and an user as parameters"
      };
      reject(error);
    }
  });
}

function updateUserByFilter(db, filter, dataToUpdate) {
  return new Promise(function (resolve, reject) {
    if (db && filter && dataToUpdate) {
      var usersCollection = db.collection('users');
      usersCollection.updateOne(filter, { $set: dataToUpdate }, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: 'You need to pass a db, filter and dataToUpdate as parameters'
      };
      reject(error);
    }
  });
}

function findUserByFilter(db, filter) {
  console.log("-> calling function findUserByFilter in UsersModel");
  return new Promise(function (resolve, reject) {
    var usersCollection = db.collection('users');
    usersCollection.findOne(filter, function (error, user) {
      if (error) {
        reject({ error: 'Database error', description: error });
      } else {
        resolve(user);
      }
    });
  });
}

function findUsersByFilter(db, filter) {
  console.log("-> calling function findUsersByFilter in UsersModel");
  return new Promise(function (resolve, reject) {
    var usersCollection = db.collection('users');
    usersCollection.find(filter, function (error, users) {
      if (error) {
        reject({ error: 'Database error', description: error });
      } else {
        resolve(users);
      }
    });
  });
}
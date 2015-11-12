'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createTokenObject = createTokenObject;
exports.tokenHasExpired = tokenHasExpired;
exports.findTokenByFilter = findTokenByFilter;
exports.insertToken = insertToken;
exports.deleteTokenByFilter = deleteTokenByFilter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constantsAPIConstants = require('../constants/APIConstants');

var _constantsAPIConstants2 = _interopRequireDefault(_constantsAPIConstants);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _configConfig = require('../config/config');

var _configConfig2 = _interopRequireDefault(_configConfig);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

/*
Tokens have this info

tokens = {
  id: ObjectId,
  accessToken: string,
  refreshToken: string,
  userId: ObjectId,
  createdAt: Date,
  expiresAt: Date,
  scopes: Array
}
*/

function createTokenObject(userId, scopes) {
  console.log("-> calling function createTokenObject in TokensModel");
  var accessToken = _nodeUuid2['default'].v4().replace(/-/g, "");
  var refreshToken = _nodeUuid2['default'].v4().replace(/-/g, "");
  var createdAt = Math.round(new Date().getTime() / 1000.0);
  var expiresAt = createdAt + 604800;
  var token = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    userId: userId,
    scopes: scopes,
    createdAt: createdAt,
    expiresAt: expiresAt
  };
  return token;
}

function tokenHasExpired(token) {
  console.log("-> calling function tokenHasExpired in TokensModel");
  var now = Math.round(new Date().getTime() / 1000.0);
  var expiresAt = token.expiresAt;
  if (now > expiresAt) {
    return true;
  } else {
    return false;
  }
}

function findTokenByFilter(db, filter) {
  console.log("-> calling function findTokenByFilter in TokensModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var tokensCollection = db.collection('tokens');
      tokensCollection.findOne(filter, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: "Missing parameters",
        description: "You have to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

function insertToken(db, token) {
  console.log("-> calling function insertToken in TokensModel");
  return new Promise(function (resolve, reject) {
    if (db && token) {
      var tokensCollection = db.collection('tokens');
      tokensCollection.insertOne(token, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: "Missing parameters",
        description: "You have to pass a db and a token as parameters"
      };
      reject(error);
    }
  });
}

function deleteTokenByFilter(db, filter) {
  console.log("-> calling function deleteTokenByFilter in TokensModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var tokensCollection = db.collection('tokens');
      tokensCollection.removeOne(filter, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: "Missing parameters",
        description: "You have to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}
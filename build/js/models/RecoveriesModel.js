'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertRecovery = insertRecovery;
exports.findRecoveriesByFilter = findRecoveriesByFilter;

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
Recoveries have this info

recoveries = {
  id: ObjectId,
  theftId: ObjectId,
  location: {
    latitude: string,
    longitude: string,
    country: string,
    department: string,
    city: string,
    neighborhood: string,
    address: string,
  },
  date: {
    year: int,
    month: int,
    day: int
  }
}
*/

function insertRecovery(db, recovery) {
  console.log("-> calling function insertRecovery in RecoveriesModel");
  return new Promise(function (resolve, reject) {
    if (db && recovery) {
      var recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.insert(recovery, function (error, result) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to db and recovery as parameters"
      };
      reject(error);
    }
  });
}

function findRecoveriesByFilter(db, filter, sort, limit) {
  console.log("-> calling function findRecoveriesByFilter in RecoveriesModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.find(filter).sort(sort).limit(limit).toArray(function (error, recoveries) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(recoveries);
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
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertRecovery = insertRecovery;
exports.findRecoveriesByFilter = findRecoveriesByFilter;
exports.deleteRecoveriesByFilter = deleteRecoveriesByFilter;

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
  userId: ObjectId,
  moto: {
    mac: string,
    brand: string,
    line: string,
    model: int,
    plate: string,
    color: string,
    cylinderCapacity: int
  },
  theftId: ObjectId,
  location: {
    country: string,
    department: string,
    city: string,
    address: string
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

function findRecoveriesByFilter(db, filter, sort, skip, limit) {
  console.log("-> calling function findRecoveriesByFilter in RecoveriesModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray(function (error, recoveries) {
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

function deleteRecoveriesByFilter(db, filter) {
  console.log("-> calling function deleteRecoveriesByFilter in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.remove(filter, function (error, result) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to db and filter as parameters"
      };
      reject(error);
    }
  });
}
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertTheft = insertTheft;
exports.getTheftsByFilter = getTheftsByFilter;

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
Thefts have this info

thefts = {
  id: ObjectId,
  motoInfo: {
    brand: string,
    line: string,
    model: int,
    plate: string,
    color: string,
    cylinderCapacity: int
  },
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

function insertTheft(db, theft) {
  console.log("-> calling function insertTheft in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && theft) {
      var theftsCollection = db.collection('thefts');
      theftsCollection.insert(theft, function (error, result) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        type: _constantsAPIConstants2['default'].MISSING_PARAMETERS,
        error: "You need to db and theft as parameters"
      };
      reject(error);
    }
  });
}

function getTheftsByFilter(db, filter) {
  console.log("-> calling function getTheftsByFilter in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var theftsCollection = db.collection('thefts');
      theftsCollection.find(filter).toArray(function (error, thefts) {
        if (error) {
          reject({ type: _constantsAPIConstants2['default'].DATABASE_ERROR, error: error });
        } else {
          resolve(thefts);
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
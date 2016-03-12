'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertTheft = insertTheft;
exports.findTheftByFilter = findTheftByFilter;
exports.findTheftsByFilter = findTheftsByFilter;
exports.deleteTheftsByFilter = deleteTheftsByFilter;

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
  location: {
    latitude: string,
    longitude: string,
    country: string,
    department: string,
    city: string,
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

function findTheftByFilter(db, filter) {
  console.log("-> calling function findTheftByFilter in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var theftsCollection = db.collection('thefts');
      theftsCollection.findOne(filter, function (error, thefts) {
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

function findTheftsByFilter(db, filter, sort, skip, limit) {
  console.log("-> calling function getTheftsByFilter in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var theftsCollection = db.collection('thefts');
      theftsCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray(function (error, thefts) {
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

function deleteTheftsByFilter(db, filter) {
  console.log("-> calling function deleteTheftByFilter in TheftModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var theftsCollection = db.collection('thefts');
      theftsCollection.remove(filter, function (error, result) {
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
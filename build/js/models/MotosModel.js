'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertMoto = insertMoto;
exports.updateMotoByFilter = updateMotoByFilter;
exports.deleteMotoByFilter = deleteMotoByFilter;
exports.findMotoByFilter = findMotoByFilter;
exports.findMotosByFilter = findMotosByFilter;

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
Motos have this info

motos = {
  id: ObjectId,
  userId: OnjectId,
  mac: string,
  brand: string,
  line: string,
  model: int,
  plate: string,
  color: string,
  cylinderCapacity: int,
  image: string,
  imageEncodeType: string,
  status: {
    monitoring: string,
    electricalFlow: string,
    safetyLock: string,
    parkingLocation: {
      latitude: string,
      longitude: string
    }
  }
}
*/

function insertMoto(db, moto) {
  console.log("-> calling function insertMoto in MotosModel");
  return new Promise(function (resolve, reject) {
    if (db && moto) {
      var motosCollection = db.collection('motos');
      motosCollection.insert(moto, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a moto as parameters"
      };
      reject(error);
    }
  });
}

function updateMotoByFilter(db, filter, dataToUpdate) {
  console.log("-> calling function updateMotoByFilter in MotosModel");
  return new Promise(function (resolve, reject) {
    if (db && filter && dataToUpdate) {
      var motosCollection = db.collection('motos');
      motosCollection.updateOne(filter, { $set: dataToUpdate }, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: "You need to pass a db, filter and dataToUpdaye as parameters"
      };
      reject(error);
    }
  });
}

function deleteMotoByFilter(db, filter) {
  console.log("-> calling function deleteMotoByFilter in MotosModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      console.log(filter);
      var motosCollection = db.collection('motos');
      motosCollection.remove(filter, function (error, result) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(result);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

function findMotoByFilter(db, filter) {
  console.log("-> calling function findMotoByFilter in MotosModel");
  return new Promise(function (resolve, reject) {
    if (db && filter) {
      var motosCollection = db.collection('motos');
      motosCollection.findOne(filter, function (error, moto) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(moto);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: "You need to pass a db, a filter and a projection as parameters"
      };
      reject(error);
    }
  });
}

function findMotosByFilter(db, filter, projection) {
  console.log("-> calling function findMotosByFilter in MotosModel");
  return new Promise(function (resolve, reject) {
    if (db && filter && projection) {
      var motosCollection = db.collection('motos');
      motosCollection.find(filter, projection).toArray(function (error, motos) {
        if (error) {
          reject({ error: 'Database error', description: error });
        } else {
          resolve(motos);
        }
      });
    } else {
      var error = {
        error: 'Missing parameters',
        description: "You need to pass a db and, a filter and a projection as parameters"
      };
      reject(error);
    }
  });
}
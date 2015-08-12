import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

export function macAlreadyExist(connection, mac) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let count = yield r.db('sismo').table('motos').count(function(moto) {
        return user('mac').eq(mac);
      }).run(connection);
      count === 0 ? resolve(false) : resolve(true);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function insertMoto(connection, moto) {
  return new Promise((resolve, reject) => {
    if (connection && moto) {
      co(function*() {
        let result = yield r.db('sismo').table('motos').insert(moto).run(connection);
        resolve(result);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a connection and moto as parameters"
      };
      reject(error);
    }
  });
}

export function updateMoto(connection, filter, data) {
  console.log("Aqui");
  console.log(filter);
  return new Promise((resolve, reject) => {
    if (connection && filter && data) {
      co(function*() {
        console.log(data);
        let result = yield r.db('sismo').table('motos').filter(filter).update(data).run(connection);
        resolve(result);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a connection, filter and data as parameters"
      };
      reject(error);
    }
  });
}



export function getMotosByUserId(connection, userId) {
  return new Promise((resolve, reject) => {
    if (connection && userId) {
      co(function*() {
        let result = yield r.db('sismo').table('motos').filter({userId:userId}).run(connection);
        let response = {};
        if(result._responses[0]){
          response = result._responses[0].r;
        }
        resolve(response);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a connection and userId as parameters"
      };
      reject(error);
    }
  });
}

export function getMotosByFilter(connection, filter) {
  console.log(filter);
  return new Promise((resolve, reject) => {
    if (connection && filter) {
      co(function*() {
        let result = yield r.db('sismo').table('motos').filter(filter).run(connection);
        let response = {};
        if(result._responses[0]){
          response = result._responses[0].r;
        }
        resolve(response);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a connection and userId as parameters"
      };
      reject(error);
    }
  });
}

export function getMotosById(connection, id) {
  return new Promise((resolve, reject) => {
    if (connection && id) {
      co(function*() {
        let result = yield r.db('sismo').table('motos').get(id).run(connection);
        resolve(result);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a connection and id as parameters"
      };
      reject(error);
    }
  });
}

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

export function insertTheft(db, theft) {
  console.log("-> calling function insertTheft in TheftModel"); 
  return new Promise((resolve, reject) => {
    if (db && theft) {
      let theftsCollection = db.collection('thefts');
      theftsCollection.insert(theft, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to db and theft as parameters"
      };
      reject(error);
    }
  });
}

export function macAlreadyExist(connection, mac) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let count = yield r.db('sismo').table('motos').count(function(moto) {
        return user('mac').eq(mac);
      }).run(connection);
      if (count === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function insertMoto(db, moto) {
  console.log("-> calling function insertMoto in MotosModel"); 
  return new Promise((resolve, reject) => {
    if (db && moto) {
      let motosCollection = db.collection('motos');
      motosCollection.insert(moto, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
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

export function updateMoto(db, filter, data) {
  return new Promise((resolve, reject) => {
    if (db && filter && data) {
      let motosCollection = db.collection('motos');
      motosCollection.updateOne(filter, {$set: data}, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db, filter and data as parameters"
      };
      reject(error);
    }
  });
}

export function deleteMoto(db, filter) {
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let motosCollection = db.collection('motos');
      motosCollection.remove(filter, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and filter as parameters"
      };
      reject(error);
    }
  });
}


export function getUserMotoByMac(db, userId, mac) {
  return new Promise((resolve, reject) => {
    if (db && userId && mac) {
      let motosCollection = db.collection('motos');
      motosCollection.findOne({userId:userId, mac: mac}, (error, moto) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(moto);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db, userId and mac as parameters"
      };
      reject(error);
    }
  });
}

export function getMotosByUserId(db, userId) {
  console.log("-> calling function getMotosByUserId in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && userId) {
      let motosCollection = db.collection('motos');
      motosCollection.find({userId:userId}).toArray((error, motos) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(motos);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and userId as parameters"
      };
      reject(error);
    }
  });
}

export function getMotosByFilter(db, filter) {
  console.log("-> calling function getMotosByFilter in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let motosCollection = db.collection('motos');
      motosCollection.find(filter).toArray((error, motos) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(motos);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and userId as parameters"
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

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

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

export function insertRecovery(db, recovery) {
  console.log("-> calling function insertRecovery in RecoveriesModel"); 
  return new Promise((resolve, reject) => {
    if (db && recovery) {
      let recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.insert(recovery, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to db and recovery as parameters"
      };
      reject(error);
    }
  });
}

export function findRecoveriesByFilter(db, filter, sort, limit) {
  console.log("-> calling function findRecoveriesByFilter in RecoveriesModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let recoveriesCollection = db.collection('recoveries');
      recoveriesCollection.find(filter).sort(sort).limit(limit).toArray((error, recoveries) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(recoveries);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';

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

export function findTheftByFilter(db, filter) {
  console.log("-> calling function findTheftByFilter in TheftModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let theftsCollection = db.collection('thefts');
      theftsCollection.findOne(filter, (error, thefts) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(thefts);
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

export function findTheftsByFilter(db, filter, sort, skip, limit) {
  console.log("-> calling function getTheftsByFilter in TheftModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let theftsCollection = db.collection('thefts');
      theftsCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray((error, thefts) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(thefts);
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

export function deleteTheftsByFilter(db, filter) {
  console.log("-> calling function deleteTheftByFilter in TheftModel"); 
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let theftsCollection = db.collection('thefts');
      theftsCollection.remove(filter, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to db and filter as parameters"
      };
      reject(error);
    }
  });
}
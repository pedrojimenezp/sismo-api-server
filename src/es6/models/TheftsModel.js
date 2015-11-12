import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';

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


export function getTheftsByFilter(db, filter) {
  console.log("-> calling function getTheftsByFilter in TheftModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let theftsCollection = db.collection('thefts');
      theftsCollection.find(filter).toArray((error, thefts) => {
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
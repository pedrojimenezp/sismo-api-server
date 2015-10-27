import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

export function insertMoto(db, moto) {
  console.log("-> calling function insertMoto in MotosModel"); 
  return new Promise((resolve, reject) => {
    if (db && moto) {
      let motosCollection = db.collection('motos');
      motosCollection.insert(moto, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a moto as parameters"
      };
      reject(error);
    }
  });
}

export function updateMotoByFilter(db, filter, dataToUpdate) {
  console.log("-> calling function updateMotoByFilter in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && filter && dataToUpdate) {
      let motosCollection = db.collection('motos');
      motosCollection.updateOne(filter, {$set: dataToUpdate}, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: "You need to pass a db, filter and dataToUpdaye as parameters"
      };
      reject(error);
    }
  });
}

export function deleteMotoByFilter(db, filter) {
  console.log("-> calling function deleteMotoByFilter in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      console.log(filter);
      let motosCollection = db.collection('motos');
      motosCollection.remove(filter, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

export function findMotoByFilter(db, filter) {
  console.log("-> calling function findMotoByFilter in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let motosCollection = db.collection('motos');
      motosCollection.findOne(filter, (error, moto) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(moto);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

export function findMotosByFilter(db, filter) {
  console.log("-> calling function findMotosByFilter in MotosModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let motosCollection = db.collection('motos');
      motosCollection.find(filter).toArray((error, motos) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(motos);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}


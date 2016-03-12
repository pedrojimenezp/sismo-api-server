import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';

/*
Users have this info

users = {
  id: objectId,
  account: {
    username: string,
    password: string
  }
}
*/
export function usernameAlreadyExist(db, username) {
  console.log("-> calling function usernameAlreadyExist in UsersModel");
  return new Promise((resolve, reject) => {
    let usersCollection = db.collection('users');
    usersCollection.findOne({'account.username':username}, (error, result) => {
      if(error){
        reject({error: 'Database error', description: error});
      }else{
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}

export function findUsers(db) {
  console.log("-> calling function findAllUsers in UsersModel");
  return new Promise((resolve, reject) => {
    let usersCollection = db.collection('users');
    usersCollection.find({},{"account.password":0}).toArray((error, docs) => {
      if(error){
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      }else{
        resolve(docs);
      }
    });
  });
}

export function insertUser(db, user) {
  console.log("-> calling function insertUser in UsersModel");
  return new Promise((resolve, reject) => {
    if (db && user) {
      let usersCollection = db.collection('users');
      usersCollection.insertOne(user, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        error: "Missing parameters",
        description: "You have to pass a db and an user as parameters"
      };
      reject(error);
    }
  });
}

export function updateUserByFilter(db, filter, dataToUpdate) {
  return new Promise((resolve, reject) => {
    if (db && filter && dataToUpdate) {
      let usersCollection = db.collection('users');
      usersCollection.updateOne(filter, {$set: dataToUpdate}, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        error: 'Missing parameters',
        description: 'You need to pass a db, filter and dataToUpdate as parameters'
      };
      reject(error);
    }
  });
}

export function findUserByFilter(db, filter) {
  console.log("-> calling function findUserByFilter in UsersModel");
  return new Promise((resolve, reject) => {
    let usersCollection = db.collection('users');
    usersCollection.findOne(filter, (error, user) => {
      if(error){
        reject({error: 'Database error', description: error});
      }else{
        resolve(user);
      }
    });
  });
}

export function findUsersByFilter(db, filter) {
  console.log("-> calling function findUsersByFilter in UsersModel");
  return new Promise((resolve, reject) => {
    let usersCollection = db.collection('users');
    usersCollection.find(filter, (error, users) => {
      if(error){
        reject({error: 'Database error', description: error});
      }else{
        resolve(users);
      }
    });
  });
}


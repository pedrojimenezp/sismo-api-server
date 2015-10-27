'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import debug from 'debug';
import uuid from 'node-uuid';

/*
Tokens have this info

tokens = {
  id: ObjectId,
  accessToken: string,
  refreshToken: string,
  userId: ObjectId,
  createdAt: Date,
  expiresAt: Date,
  scopes: Array
}
*/

export function createTokenObject(userId, scopes) {
  console.log("-> calling function createTokenObject in TokensModel");
  let accessToken = uuid.v4().replace(/-/g,"");
  let refreshToken = uuid.v4().replace(/-/g,"");
  let createdAt = Math.round(new Date().getTime()/1000.0);
  let expiresAt = createdAt+604800;
  let token = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    userId: userId,
    scopes: scopes,
    createdAt: createdAt,
    expiresAt: expiresAt
  }
  return token;
}

export function tokenHasExpired(token) {
  console.log("-> calling function tokenHasExpired in TokensModel");
  let now = Math.round(new Date().getTime()/1000.0);
  let expiresAt = token.expiresAt;
  if (now > expiresAt) {
    return true;
  }else{
    return false;
  }
}

export function findTokenByFilter(db, filter) {
  console.log("-> calling function findTokenByFilter in TokensModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let tokensCollection = db.collection('tokens');
      tokensCollection.findOne(filter, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      let error = {
        error: "Missing parameters",
        description: "You have to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

export function insertToken(db, token) {
  console.log("-> calling function insertToken in TokensModel");
  return new Promise((resolve, reject) => {
    if (db && token) {
      let tokensCollection = db.collection('tokens');
      tokensCollection.insertOne(token, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      let error = {
        error: "Missing parameters",
        description: "You have to pass a db and a token as parameters"
      };
      reject(error);
    }
  });
}

export function deleteTokenByFilter(db, filter) {
  console.log("-> calling function deleteTokenByFilter in TokensModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let tokensCollection = db.collection('tokens');
      tokensCollection.removeOne(filter, (error, result) => {
        if(error){
          reject({error: 'Database error', description: error});
        }else{
          resolve(result);
        }
      });
    } else {
      let error = {
        error: "Missing parameters",
        description: "You have to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}

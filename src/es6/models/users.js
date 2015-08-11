import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

export function usernameAlreadyExist(connection, username, callback) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let count = yield r.db('sismo').table('users').count(function(user) {
        return user('account')('username').eq(username);
      }).run(connection);
      count === 0 ? resolve(false) : resolve(true);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function insertUser(connection, username, password) {
  return new Promise((resolve, reject) => {
    if (username && password) {
      co(function*() {
        let result = yield r.db('sismo').table('users').insert({account: {username, password}}).run(connection);
        resolve(result);
      }).catch((error) => {
        reject({type: APIConstants.DATABASE_ERROR, error: error});
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "Missing username or password"
      };
      reject(error);
    }
  });
}

export function getUserById(connection, id) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let result = yield r.db('sismo').table('users').get(id).run(connection);
      resolve(result);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function getAllUsers(connection) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let result = yield r.table('users').filter({}).run(connection);
      resolve(result._responses);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function getUserByUsername(connection, username) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let result = yield r.table('users').filter({account: {username: username}}).run(connection);
      let user = {};
      if(result._responses.length > 0){
        user = result._responses[0].r[0];
      }
      resolve(user);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}


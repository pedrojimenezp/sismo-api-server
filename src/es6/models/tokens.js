'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';
import debug from 'debug';


export function createAnAccessToken(connection, userId, username, scopes) {
  let error;
  return new Promise((resolve, reject) => {
    if (connection && userId && scopes) {
      let tokenId = shortid.generate();
      let accessToken = jwt.sign({
        id: tokenId,
        userId: userId,
        username: username,
        scopes: scopes
      }, config.server.secret, {expiresInMinutes:10080});
      co(function*() {
        let refreshToken = shortid.generate();
        let result = yield r.db('sismo').table('tokens').insert({accessToken: accessToken, refreshToken: refreshToken}).run(connection);
        resolve(result);
      }).catch((error) => {
        error = {
          type: APIConstants.DATABASE_ERROR,
          error: error
        };
        reject(error);
      });
    } else {
      error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "Missing connection or accessToken"
      };
      reject(error);
    }
  });
}

export function getTokenById(connection, id) {
  return new Promise((resolve, reject) => {
    const self = this;
    co(function*() {
      let result = yield r.db('sismo').table('tokens').get(id).run(connection);
      resolve(result);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function deleteTokenById(connection, id) {
  return new Promise((resolve, reject) => {
    const self = this;
    co(function*() {
      let result = yield r.db('sismo').table('tokens').get(id).delete().run(connection);
      resolve(result);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function getTokenByAccessToken(connection, accessToken) {
  return new Promise((resolve, reject) => {
    const self = this;
    co(function*() {
      let result = yield r.db('sismo').table('tokens').filter({accessToken: accessToken}).run(connection);
      let response = {};
      if(result._responses[0]){
        response = result._responses[0].r[0];
      }
      resolve(response);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

export function deleteTokenByAccessToken(connection, accessToken) {
  return new Promise((resolve, reject) => {
    const self = this;
    co(function*() {
      let result = yield r.db('sismo').table('tokens').filter({accessToken: accessToken}).delete().run(connection);
      resolve(result);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

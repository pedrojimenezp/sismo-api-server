'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';
import debug from 'debug';


export function createAnAccessToken(connection, username, scopes) {
  let error;
  return new Promise((resolve, reject) => {
    if (connection && username && scopes) {
      let accessToken = jwt.sign({
        username: username,
        scopes: scopes
      }, config.server.secret);
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

export function getTokenById(connection, key) {
  return new Promise((resolve, reject) => {
    const self = this;
    co(function*() {
      let result = yield r.db('sismo').table('tokens').get(key).run(connection);
      resolve(result);
    }).catch((error) => {
      reject({type: APIConstants.DATABASE_ERROR, error: error});
    });
  });
}

'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';
import * as tokens from '../models/tokens';
import * as users from '../models/users';
import * as httpResponses from '../helpers/httpResponses';

export default class UsersControllers {
  constructor(connection){
    this.connection = connection;
  }

  getAllUsers(req, res) {
    let self = this;
    co(function*() {
      let response = yield users.getAllUsers(self.connection);
      res.status(200).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getUserByUsername(req, res) {
    let self = this;
    co(function*() {
      let response = yield users.getUserByUsername(self.connection, req.params.username);
      if(response.account) {
        delete response.account.password;
      }
      res.status(200).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  createAnUser(req, res) {
    let response;
    if (req.body.username && req.body.password) {
      const self = this;
      co(function*() {
        let usernameAlreadyExist = yield users.usernameAlreadyExist(self.connection, req.body.username);
        if (usernameAlreadyExist) {
          response = {
            code: "409",
            type: APIConstants.CONFLICT,
            error: "Username already exist"
          };
          res.status(409).send(response);
        } else {
          let result; //Result of any insert operation
          result = yield users.insertUser(self.connection, req.body.username, req.body.password);
          let userInserted = yield users.getUserById(self.connection, result.generated_keys[0]);
          let username = userInserted.account.username;
          delete userInserted.account.password;
          let scopes = {};
          result = yield tokens.createAnAccessToken(self.connection, username, scopes);
          let tokenInserted = yield tokens.getTokenById(self.connection, result.generated_keys[0]);
          response = {
            code: 201,
            userCreated: userInserted,
            accessToken: tokenInserted.accessToken,
            refreshToken: tokenInserted.refreshToken
          }
          res.status(201).send(response);
        }
      }).catch((error) => {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    } else {
      httpResponses.internalServerError(res);
    }
  }
}

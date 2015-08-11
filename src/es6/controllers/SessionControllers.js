'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';

import * as tokens from '../models/tokens';
import * as users from '../models/users';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';

//console.log(helpers);

//import MQTTClient from '../MQTTClient';

export default class SessionControllers {
  constructor(connection){
    this.connection = connection;
  }

  createSession(req, res) {
    let response;
    let result;
    let self = this;
    if (req.body.username && req.body.password) {
      co(function*() {
        let user = yield users.getUserByUsername(self.connection, req.body.username);
        if (!helpers.isEmpty(user) && user.account.password === req.body.password) {
          let username = user.account.username;
          delete user.account.password;
          let scopes = {};
          result = yield tokens.createAnAccessToken(self.connection, username, scopes);
          let tokenInserted = yield tokens.getTokenById(self.connection, result.generated_keys[0]);
          response = {
            code: 201,
            type: APIConstants.LOGIN_SUCCESS,
            accessToken: tokenInserted.accessToken,
            refreshToken: tokenInserted.refreshToken
          }
          res.status(201).send(response);
        } else {
          response = {
            code: "401",
            type: APIConstants.UNAUTHORIZED,
            error: "Incorrect username or password"
          };
          res.status(401).send(response);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      response = {
        code: "400",
        type: APIConstants.BAD_REQUEST,
        error: "You must to pass and username and password"
      };
      res.status(400).send(response);
    }
  }

  deleteSession(req, res) {
    let response;
    let result;
    let self = this;
    if (req.headers['access-token']) {
      co(function*() {
        result = yield tokens.deleteTokenByAccessToken(self.connection, req.headers['access-token']);
        response = {
          code: 200,
          type: APIConstants.LOGOUT_SUCCESS
        }
        res.status(200).send(response);
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      response = {
        code: "400",
        type: APIConstants.BAD_REQUEST,
        error: "You must to pass an access token"
      };
      res.status(400).send(response);
    }
  }

  getMQTTToken(req, res) {
    let username = req.user.account.username;
    let MQTTToken = jwt.sign({
      username: `${username}`,
      clientType: 'app',
      subscribeChannelsAllowed: [`/apps/users/${username}`, '/motos/1'],
      publishChannelsAllowed: [`/apps/users/${username}`, '/motos/1'],
    }, 'secret');
    res.send({MQTTToken: MQTTToken});
  }
}

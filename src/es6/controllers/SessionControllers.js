'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';

import config from '../config/config';

import * as tokens from '../models/tokens';
import * as users from '../models/users';
import * as motos from '../models/motos';
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
          let userId = user.id;
          let username = user.account.username;
          delete user.account.password;
          let scopes = {};
          result = yield tokens.createAnAccessToken(self.connection, userId, username, scopes);
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

  createMQTTToken(req, res) {
    let username = req.user.account.username;
    let filter = {
      userId: req.user.id
    };
    let self = this;
    co(function*() {
      let userMotos = yield motos.getMotosByFilter(self.connection, filter);
      let subscribeChannelsAllowed = [`/apps/users/${username}`];
      let publishChannelsAllowed = [`/apps/users/${username}`];
      let length = userMotos.length;
      for (let i = 0; i < length; i++) {
        publishChannelsAllowed.push(`/motos/${userMotos[i].mac}`);
        subscribeChannelsAllowed.push(`/motos/${userMotos[i].mac}`);
      }
      let MQTTToken = jwt.sign({
        username: `${username}`,
        clientType: 'app',
        subscribeChannelsAllowed: subscribeChannelsAllowed,
        publishChannelsAllowed: publishChannelsAllowed,
      }, 'secret');
      res.send({MQTTToken: MQTTToken});
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  createAccessTokenFromRefreshToken(req, res) {
    let response;
    let result;
    let self = this;
    if (req.headers['access-token'] && req.headers["refresh-token"]) {
      let accessToken = req.headers['access-token'];
      let refreshToken = req.headers['refresh-token'];

      let userId = req.user.id;
      let username = req.user.account.username;
      let scopes = {};
      co(function*() {
        let token = yield tokens.getTokenByAccessToken(self.connection, accessToken);
        if(!helpers.isEmpty(token)){
          if(token.refreshToken === refreshToken){
            result = yield tokens.createAnAccessToken(self.connection, userId, username, scopes);
            //console.log(result);
            let newToken = yield tokens.getTokenById(self.connection, result.generated_keys[0]);
            result = yield tokens.deleteTokenById(self.connection, token.id);
            //console.log(result);
            res.send(newToken);
          }else{
            response = {
              code: "401",
              type: APIConstants.UNAUTHORIZED,
              error: "The refresh token is invalid"
            }
            res.status(401).send(response);
          }
        }else{
          response = {
            code: "401",
            type: APIConstants.UNAUTHORIZED,
            error: "The token hasn't registered in the db"
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
        error: "You must to pass an access-token and refresh-token in header of the request"
      };
      res.status(400).send(response);
    }
  }
}

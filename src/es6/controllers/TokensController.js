'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';

import config from '../config/config';

import * as usersModel from '../models/UsersModel';
import * as motosModel from '../models/MotosModel';
import * as tokensModel from '../models/TokensModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';

export default class TokensControllers {
  constructor(db){
    this.db = db;
  }

  verifyAccessToken(req, res) {
    console.log("-> callling function verifyAccessToken in TokensControllers");
    let self = this;
    let response;
    let accessToken;
    let errorResponse;
    if(req.query["access-token"]){
      accessToken = req.query["access-token"];
      co(function*() {
        let filter = {accessToken:accessToken};
        let result = yield tokensModel.findTokenByFilter(self.db, filter);
        response = {
          code: 200,
          type: APIConstants.OK,
          verification: {
            result : APIConstants.TOKEN_VALID,
            description: "The access token is valid"
          }
        };
        if (result) {
          if (tokensModel.tokenHasExpired(result)) {
            response.verification.result = APIConstants.TOKEN_EXPIRED;
            response.verification.description = "The access token has expired";
          }
        } else {
          response.verification.result = APIConstants.TOKEN_INVALID;
          response.verification.description = "The access token is invalid";
        }
        res.status(response.code).send(response);
      }).catch((error) => {
        httpResponses.internalServerError(res, error);
      });
    } else {
      errorResponse = {
        error: "Access token not provided",
        description: "You have to send a access-token in the url"
      }
      httpResponses.badRequest(res, "You must to send a access-token in the header or in the url");
    }
  }

  createToken(req, res) {
    console.log("-> callling function createToken in TokensController");
    let self = this;
    let response;
    let result;
    let errorResponse;
    if(req.headers.authorization && req.headers.authorization !== ""){
      let authorization = req.headers.authorization.split(" ");
      if(authorization[0] === "Basic"){
        if(authorization[1] !== ""){
          let usernameAndPassword = new Buffer(authorization[1], 'base64').toString();
          let array = usernameAndPassword.split(":");
          if(array.length === 2){
            let username = array[0];
            let password = array[1];
            co(function*() {
              let user = yield usersModel.findUserByFilter(self.db, {'account.username': username});
              console.log(user);
              if (!helpers.isEmpty(user) && user.account.password === password) {
                let userId = user._id;
                let scopes = ["motos", "profile", "thefts", "recoveries", "logs", "tokens"];
                let token = tokensModel.createTokenObject(userId, scopes);
                result = yield tokensModel.insertToken(self.db, token);
                let tokenInserted = result.ops[0];
                delete tokenInserted.userId;
                delete tokenInserted._id;
                response = {
                  tokens: tokenInserted
                };
                httpResponses.Ok(res, response);
              } else {
                errorResponse = {
                  error: "Wrong username or password",
                  description: "The username or password you sent are incorrects"
                };
                httpResponses.unauthorized(res, errorResponse);
              }
            }).catch((error) => {
              httpResponses.internalServerError(res, error);
            });
          } else {
            errorResponse = {
              error: "Wrong username:password codification",
              description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
            };
            httpResponses.badRequest(res, errorResponse);
          }
        }else{
          errorResponse = {
            error: "Wrong format of Basic authentication method",
            description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
          };
          httpResponses.badRequest(res, errorResponse);
        }
      }else{
        errorResponse = {
          type: "Wrong format of Basic authentication method",
          description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
        }
        httpResponses.badRequest(res, errorResponse);
      }
    }else{
      let accessToken = "";
      let refreshToken = "";
      if (req.headers["access-token"] && req.headers["refresh-token"]){
        accessToken = req.headers["access-token"];
        refreshToken = req.headers["refresh-token"];
      } else if (req.query["access-token"] && req.query["refresh-token"]){
        accessToken = req.query["access-token"];
        refreshToken = req.query["refresh-token"];
      } else if (req.body["access-token"] && req.body["refresh-token"]){
        accessToken = req.body["access-token"];
        refreshToken = req.body["refresh-token"];
      }
      if (accessToken !== "" && refreshToken !== "") {
        co(function*() {
          let filter = {
            accessToken: accessToken
          };
          result = yield tokensModel.findTokenByFilter(self.db, filter);
          if (result) {
            if (result.refreshToken === refreshToken) {
              let token = tokensModel.createTokenObject(result.userId, result.scopes);
              result = yield tokensModel.insertToken(self.db, token);
              let tokenInserted = result.ops[0];
              delete tokenInserted.userId;
              delete tokenInserted._id;
              filter.refreshToken = refreshToken;
              console.log(filter);
              result = yield tokensModel.deleteTokenByFilter(self.db, filter)
              response = {
                tokens: tokenInserted
              };
              httpResponses.Ok(res, response);
            }else{
              errorResponse = {
              error: "Invalid refresh-token",
                description: "The refresh token you sent in the header is invalid"
              };
            httpResponses.unauthorized(res, errorResponse);
            }
          } else {
            errorResponse = {
              error: "Invalid access token",
              description: "The access token you sent in the header is invalid"
            };
            httpResponses.unauthorized(res, errorResponse);
          }
        }).catch((error) => {
          httpResponses.internalServerError(res, error);
        });
      } else {
        errorResponse = {
          error: "Invalid authentication method",
          description: "To get an access-token you must to use one of 2 authentication methods. Method 1: use the Basic authentication  it means send username:password with base64 codification in the authentication header with Basic flag. Method 2: send an access-token and refresh-token in headers with the same names"
        }
        httpResponses.badRequest(res, errorResponse);
      }
    }
  }

  deleteToken(req, res) {
    console.log("-> callling function deleteToken in TokensController");
    let self = this;
    let response;
    let result;
    co(function*() {
      let filter = {accessToken:req.accessToken};
      result = yield tokensModel.deleteTokenByFilter(self.db, filter);
      response = {
        code: 200,
        result: 'Token deleted'
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      httpResponses.internalServerError(res);
    });
  }

  createMQTTToken(req, res) {
    let username = req.user.account.username;
    let filter = {
      userId: req.user.id
    };
    let self = this;
    let response;
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
      response = {
        code: 201,
        MQTTToken: MQTTToken
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
}


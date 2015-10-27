import co from 'co';
import polyfill from 'babel/polyfill';

import * as usersModel from '../models/UsersModel';
import * as motosModel from '../models/MotosModel';
import * as tokensModel from '../models/TokensModel';
import * as httpResponses from './httpResponses';

export default class Middlewares {
  constructor(db){
    this.db = db;
  }

  tokenHasExpired(req, res, next){
    console.log("-> callling function hasExpired in Middlewares");
    let self = this;
    let response;
    let errorResponse;
    let accessToken;
    if (req.headers['access-token']) {
      accessToken = req.headers['access-token'];
    }else if (req.headers.authorization) {
      let authorization = req.headers.authorization.split(" ");
      if(authorization[0] === "Bearer"){
        if(authorization[1] !== ""){
          accessToken = authorization[1];
        }else{
          errorResponse = {
            error: "Wrong format of Bearer authorization method",
            description: "To use the Bearer authorization you must to send a access token in the authorization header with Bearer flag"
          };
        }
      }else{
        errorResponse = {
          error: "Wrong format of Bearer authorization method",
          description: "To use the Bearer authorization you must to send a access token in the authorization header with Bearer flag"
        };
      }
    }else{
      errorResponse = {
        error: "Access token not provided",
        description: "You must to send an access token in the header of the request, it can be sent with the access-token header or can be sent with the authorization header as a Bearer token with this form (Bearer your-access-token)"
      };
    }
    if (errorResponse) {
      httpResponses.badRequest(res, errorResponse);
    } else{
      co(function*() {
        let filter = {accessToken:accessToken};
        let result = yield tokensModel.findTokenByFilter(self.db, filter);
        if (result) {
          if (!tokensModel.tokenHasExpired(result)) {
            req.user = {
              id: result.userId,
              scopes: result.scopes,
              accessToken: accessToken,
            }
            next();
          } else {
            errorResponse = {
              error: "Access token has expired",
              description: "The token you sent has expired"
            };
            httpResponses.unauthorized(res, errorResponse);
          }
        } else {
          errorResponse = {
            error: "Invalid access token",
            description: "The token you sent is not a valid token"
          };
          httpResponses.unauthorized(res, errorResponse);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res, error);
      });
    }
  }

  canAccessToThisScope(req, res, scope, next){
    console.log("-> callling function canAccessToThisScope in Middlewares");
    let self = this;
    let errorResponse;
    if(req.user.scopes.indexOf(scope) >= 0) {
      co(function*() {
        let filter = {_id:req.user.id};
        let result = yield usersModel.findUserByFilter(self.db, filter);
        req.user.username = result.account.username;
        next();
      }).catch((error) => {
        httpResponses.internalServerError(res, error);
      });
    }else{
      errorResponse = {
        error: "Can access to this  resource",
        description: "The token you sent is valid but hasn't the permits to access to this resource"
      };
      httpResponses.unauthorized(res, errorResponse);
    }
  }
}
"use strict";
import express from 'express';
import jwt from "jsonwebtoken";
//const router = express.Router();

import UsersControllers from '../controllers/UsersControllers';
import SessionControllers from '../controllers/SessionControllers';
import config from '../config/config';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import APIConstants from '../constants/APIConstants';

//import MQTTClient from '../MQTTClient';

//let notifications = [];

export default class ApiRoutes {
  constructor(app, connection) {
    this.app = app;
    this.usersControllers = new UsersControllers(connection);
    this.sessionControllers = new SessionControllers(connection);
    this.makeRoutes();
  }

  makeRoutes() {
    // Middleware that allows cross domain
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    //urls for the api v1

    this.app.post('/api/v1/sessions', (req, res) => this.sessionControllers.createSession(req, res));
    this.app.delete('/api/v1/sessions', (req, res) => this.sessionControllers.deleteSession(req, res));

    this.app.post('/api/v1/users', (req, res) => this.usersControllers.createAnUser(req, res));

    this.app.get('/api/v1/users/:username', this._canMakeThisRequest, (req, res) => this.usersControllers.getUserByUsername(req, res));

    this.app.put('/api/v1/users/:username/profile', this._canMakeThisRequest, (req, res) => this.usersControllers.updateUserProfile(req, res));

    this.app.post('/api/v1/users/:username/motos', this._canMakeThisRequest, (req, res) => this.usersControllers.addAnUserMoto(req, res));

    this.app.get('/api/v1/users/:username/motos', this._canMakeThisRequest, (req, res) => this.usersControllers.getAllUserMotos(req, res));

    this.app.get('/api/v1/users/:username/motos/:mac', this._canMakeThisRequest, (req, res) => this.usersControllers.getAnUserMotoByMac(req, res));

    this.app.put('/api/v1/users/:username/motos/:mac', this._canMakeThisRequest, (req, res) => this.usersControllers.updateAnUserMotoByMac(req, res));

    this.app.delete('/api/v1/users/:username/motos/:mac', this._canMakeThisRequest, (req, res) => this.usersControllers.deleteAnUserMotoByMac(req, res));

    this.app.get('/api/v1/tokens/mqtt', this._canMakeThisRequest, (req, res) => this.sessionControllers.createMQTTToken(req, res));

    this.app.get('/api/v1/tokens/access', this._isAValidToken, (req, res) => this.sessionControllers.createAccessTokenFromRefreshToken(req, res));
  }

  //Middleware to verify access tokens
  _isAValidToken(req, res, next){
    let response;
    if(req.headers['access-token']) {
      let accessToken = req.headers['access-token'];
      jwt.verify(accessToken, config.server.secret, function(error, decode) {
        if(error && error.name !== "TokenExpiredError") {
          if(error.name === "JsonWebTokenError"){
            httpResponses.badRequest(res, "The access-token is invalild");
          } else{
            httpResponses.internalServerError(res);
          }
        } else {
          req.user = {
            id: decode.userId,
            account: {
              username: decode.username
            }
          };
          if (req.params.username) {
            if(decode.username !== req.params.username) {
              if (decode.scopes.others.indexOf(req.method.toLowerCase()) > -1){
                next();
              } else {
                httpResponses.unauthorized(res, "The token is valid but you can't make this request");
              }
            } else {
              if (decode.scopes.me.indexOf(req.method.toLowerCase()) > -1){
                next();
              } else {
                httpResponses.unauthorized(res, "The token is valid but you can't make this request");
              }
            }
          } else {
            next();
          }
        }
      });
    } else {
      httpResponses.badRequest(res, "You have to pass a JWT in the access-token header");
    }
  }

  _canMakeThisRequest(req, res, next){
    let response;
    if(req.headers['access-token']) {
      let accessToken = req.headers['access-token'];
      jwt.verify(accessToken, config.server.secret, function(error, decode) {
        if(error) {
          helpers.responseToAnError(res, error);
        } else {
          req.user = {
            id: decode.userId,
            account: {
              username: decode.username
            }
          };
          if (req.params.username) {
            if(decode.username !== req.params.username) {
              if (decode.scopes.others.indexOf(req.method.toLowerCase()) > -1){
                next();
              } else {
                httpResponses.unauthorized(res, "The token is valid but you can't make this request");
              }
            } else {
              if (decode.scopes.me.indexOf(req.method.toLowerCase()) > -1){
                next();
              } else {
                httpResponses.unauthorized(res, "The token is valid but you can't make this request");
              }
            }
          } else {
            next();
          }
        }
      });
    } else {
      httpResponses.badRequest(res, "You have to pass a JWT in the access-token header");
    }
  }
}

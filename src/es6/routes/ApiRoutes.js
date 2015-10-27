"use strict";
import express from 'express';
import jwt from "jsonwebtoken";
//const router = express.Router();

import UsersControllers from '../controllers/UsersController';
import TokensControllers from '../controllers/TokensController';
import SessionControllers from '../controllers/SessionController';
import Middlewares from '../helpers/Middlewares';
import config from '../config/config';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import APIConstants from '../constants/APIConstants';

//import MQTTClient from '../MQTTClient';

//let notifications = [];

export default class ApiRoutes {
  constructor(app, db) {
    this.app = app;
    this.middlewares = new Middlewares(db);
    this.usersControllers = new UsersControllers(db);
    this.sessionControllers = new SessionControllers(db);
    this.tokensControllers = new TokensControllers(db);
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

    this.app.get('/api/v1/access-token', (req, res) => this.tokensControllers.createToken(req, res));
    this.app.delete('/api/v1/access-token',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "tokens", next),
      (req, res) => this.tokensControllers.deleteToken(req, res));
    
    
    this.app.post('/api/v1/users', (req, res) => this.usersControllers.createUser(req, res));
    //this.app.get('/api/v1/users', (req, res) => this.usersControllers.getAllUsers(req, res));


    this.app.get('/api/v1/users/:username', 
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "profile", next),
      (req, res) => this.usersControllers.getUserByUsername(req, res));

    /*this.app.put('/api/v1/users/:username/profile', this._canMakeThisRequest, (req, res) => this.usersControllers.updateUserProfile(req, res));
*/
    this.app.post('/api/v1/users/:username/motos', 
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next), 
      (req, res) => this.usersControllers.addUserMoto(req, res));

    this.app.get('/api/v1/users/:username/motos',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.getAllUserMotos(req, res));

    this.app.get('/api/v1/users/:username/motos/:mac', 
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.getUserMotoByMac(req, res));
    
    this.app.get('/api/v1/users/:username/motos/:mac/image',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.getUserMotoImageByMac(req, res));

    this.app.put('/api/v1/users/:username/motos/:mac',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.updateUserMotoByMac(req, res));

    this.app.delete('/api/v1/users/:username/motos/:mac',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.deleteUserMotoByMac(req, res));

    this.app.get('/api/v1/users/:username/motos/:mac/status',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.getUserMotoStatusByMac(req, res));

    this.app.put('/api/v1/users/:username/motos/:mac/status',
      (req, res, next) => this.middlewares.tokenHasExpired(req, res, next),
      (req, res, next) => this.middlewares.canAccessToThisScope(req, res, "motos", next),  
      (req, res) => this.usersControllers.updateUserMotoStatusByMac(req, res));

    this.app.get('/api/v1/verification/access-token', (req, res) => this.tokensControllers.verifyAccessToken(req, res));


    this.app.post('/api/v1/motos/access-token', (req, res) => this.sessionControllers.createMotoAccessToken(req, res));
  }
}

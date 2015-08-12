"use strict";
import express from 'express';
import jwt from "jsonwebtoken";
//const router = express.Router();

import UsersControllers from '../controllers/UsersControllers';
import SessionControllers from '../controllers/SessionControllers';
import config from '../config/config';
import * as httpResponses from '../helpers/httpResponses';
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
    // Allow cross domain
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    //urls for the api v1

    //post => /api/v1/session
    this.app.post('/api/v1/sessions', (req, res) => this.sessionControllers.createSession(req, res));
    //delete => /api/v1/session
    this.app.delete('/api/v1/sessions', (req, res) => this.sessionControllers.deleteSession(req, res));

    //post => /api/v1/users
    this.app.post('/api/v1/users', (req, res) => this.usersControllers.createAnUser(req, res));
    //get => /api/v1/users
    //this.app.get('/api/v1/users', (req, res) => this.usersControllers.getAllUsers(req, res));

    //get => /api/v1/users/:username
    this.app.get('/api/v1/users/:username', (req, res) => this.usersControllers.getUserByUsername(req, res));

    //post => /api/v1/users/:username/motos
    this.app.post('/api/v1/users/:username/motos', this._jwtVerification, (req, res) => this.usersControllers.addAnUserMoto(req, res));
    //get => /api/v1/users/:username/motos
    this.app.get('/api/v1/users/:username/motos', this._jwtVerification, (req, res) => this.usersControllers.getAllUserMotos(req, res));

    //get => /api/v1/users/:username/motos/:motoId
    this.app.get('/api/v1/users/:username/motos/:mac', this._jwtVerification, (req, res) => this.usersControllers.getAnUserMoto(req, res));
    //update => /api/v1/users/:username/motos/:motoId
    this.app.put('/api/v1/users/:username/motos/:mac', this._jwtVerification, (req, res) => this.usersControllers.updateAnUserMoto(req, res));
    //delete => /api/v1/users/:username/motos/:motoId

    //get => /api/v1/tokens/mqtt
    //get => /api/v1/tokens/access
    //get => /api/v1/tokens/refresh

    //this.app.get('/', (req, res) => this.usersControllers.index(req, res));

    this.app.get('/api/users', this._jwtVerification,(req, res) => this.usersControllers.getUsers(req, res));






    //URL to get the MQTT token
    this.app.get('/api/mqtt-token', this._jwtVerification, (req, res) => this.sessionControllers.getMQTTToken(req, res));

    //this.app.get('/api/tokens/')
    /*
    this.app.get('/api/users/:username/notifications', (req, res) => {
      let ns = [];
      notifications.forEach((notification) => {
        if (notification.username === req.params.username) {
          ns.push(notification);
        }
      });
      res.send(ns);
    });

    this.app.post('/api/users/:username/notifications', (req, res) => {
      let notification = {username:req.params.username, message: req.body.message};
      notifications.push(notification);
      MQTTClient.publish(`api/users/${req.params.username}/notifications`, 'new notifications');
      res.send(notification);
    })*/
  }


  //This method verify if the request has a accessToken header, and then try to verify if the Json Web Token (JWT) is valid, then pass to the next method
  _jwtVerification(req, res, next) {
    let response;
    if(req.headers['access-token']) {
      let accessToken = req.headers['access-token'];
      jwt.verify(accessToken, config.server.secret, function(error, decode) {
        if(error) {
          if(error.name === "JsonWebTokenError"){
            response = {
              code: "400",
              type: APIConstants.BAD_REQUEST,
              error: "The access-token is invalild"
            };
            res.status(400).send(response);
          } else if(error.name === "TokenExpiredError") {
            response = {
              code: "401",
              type: APIConstants.UNAUTHORIZED,
              error: "The access-token has expired"
            }
            res.status(401).send(response);
          } else{
            httpResponses.internalServerError(res);
          }
        } else {
          if(decode.username !== req.params.username) {
            response = {
              code: "401",
              type: APIConstants.UNAUTHORIZED,
              error: "The token is valid but isn't associated to this username"
            }
            res.status(401).send(response);
          }else{
            req.user = {
              id: decode.userId,
              account: {
                username: decode.username
              }
            }
            next();
          }

        }
      });
    } else {
      res.send('You have to pass a JWT in the access-token header');
    }
  }

}

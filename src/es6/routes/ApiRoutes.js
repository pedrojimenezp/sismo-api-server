"use strict";
import express from 'express';
//const router = express.Router();

import UsersControllers from '../controllers/UsersController';
import MotosControllers from '../controllers/MotosController';
import TokensControllers from '../controllers/TokensController';
import Middlewares from '../helpers/Middlewares';
import config from '../config/config';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import APIConstants from '../constants/APIConstants';

export default class ApiRoutes {
  constructor(app, db) {
    this.app = app;
    this.middlewares = new Middlewares(db);
    this.usersControllers = new UsersControllers(db);
    this.motosControllers = new MotosControllers(db);
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

    this.app.get('/', (req, res) => {
      res.render("index.html");
    });
    
    this.app.post('/api/v1/login', (req, res) => this.usersControllers.login(req, res));
    
    this.app.post('/api/v1/users', (req, res) => this.usersControllers.insertUser(req, res));
    
    this.app.get('/api/v1/users', (req, res) => this.usersControllers.getUsers(req, res));

    this.app.get('/api/v1/users/:username', (req, res) => this.usersControllers.getUserByUsername(req, res));

    this.app.post('/api/v1/motos', (req, res) => this.motosControllers.insertMoto(req, res));

    this.app.get('/api/v1/motos', (req, res) => this.motosControllers.getMotos(req, res));

    this.app.get('/api/v1/motos/:mac', (req, res) => this.motosControllers.getMotoByMac(req, res));
    
    this.app.put('/api/v1/motos/:mac',(req, res) => this.motosControllers.updateMotoByMac(req, res));
    
    this.app.delete('/api/v1/motos/:mac', (req, res) => this.motosControllers.deleteMotoByMac(req, res));
    
    this.app.get('/api/v1/motos/:mac/image', (req, res) => this.motosControllers.getMotoImageByMac(req, res));

    this.app.put('/api/v1/motos/:mac/status', (req, res) => this.motosControllers.updateMotoStatusByMac(req, res));

    this.app.get('/api/v1/verification/access-token', (req, res) => this.tokensControllers.verifyAccessToken(req, res));
  }
}

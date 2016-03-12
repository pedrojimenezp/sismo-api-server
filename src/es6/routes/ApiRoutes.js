"use strict";
import express from 'express';
//const router = express.Router();

import UsersController from '../controllers/UsersController';
import MotosController from '../controllers/MotosController';
import ViewsController from '../controllers/ViewsController';
import TheftsController from '../controllers/TheftsController';
import RecoveriesController from '../controllers/RecoveriesController';
import Middlewares from '../helpers/Middlewares';
import config from '../config/config';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import APIConstants from '../constants/APIConstants';

import co from 'co';


export default class ApiRoutes {
  constructor(app, db) {
    this.app = app;
    this.middlewares = new Middlewares(db);
    this.usersController = new UsersController(db);
    this.motosController = new MotosController(db);
    this.theftsController = new TheftsController(db);
    this.recoveriesController = new RecoveriesController(db);
    this.viewsController = new ViewsController(db);
    this.makeRoutes();
  }

  makeRoutes() {
    // Middleware that allows cross domain
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    this.app.get('/', (req, res) => this.viewsController.renderIndex(req, res));
    this.app.get('/thefts', (req, res) => this.viewsController.renderThefts(req, res));
    this.app.get('/recoveries', (req, res) => this.viewsController.renderRecoveries(req, res));

    this.app.get('/error', (req, res) => this.viewsController.renderError(req, res));

    this.app.get('/:username/motos', (req, res) => this.viewsController.renderUserMotos(req, res));
    
    this.app.get('/:username/motos/:mac/update', (req, res) => this.viewsController.renderUpdateUserMotos(req, res));

    this.app.get('/:username/thefts', (req, res) => this.viewsController.renderUserThefts(req, res));
    
    this.app.get('/:username/recoveries', (req, res) => this.viewsController.renderUserRecoveries(req, res));

    this.app.get('/:username/recoveries/add', (req, res) => this.viewsController.renderAddUserRecoveries(req, res));
    
    this.app.get('/signin', (req, res) => this.viewsController.renderSignin(req, res));

    this.app.get('/signup', (req, res) => this.viewsController.renderSignup(req, res));

    this.app.get('/logout', (req, res) => {
      req.session.destroy();
      res.cookie("isLogged", false);
      res.redirect('/'); 
    });
    
    this.app.post('/api/v1/login', (req, res) => this.usersController.login(req, res));
    this.app.post('/api/v1/login2', (req, res) => this.usersController.login2(req, res));
    
    this.app.post('/api/v1/users', (req, res) => this.usersController.insertUser(req, res));
    
    this.app.get('/api/v1/users', (req, res) => this.usersController.getUsers(req, res));

    this.app.get('/api/v1/users/:username', (req, res) => this.usersController.getUserByUsername(req, res));

    this.app.post('/api/v1/motos', (req, res) => this.motosController.insertMoto(req, res));

    this.app.get('/api/v1/motos', (req, res) => this.motosController.getMotos(req, res));

    this.app.get('/api/v1/motos/:mac', (req, res) => this.motosController.getMotoByMac(req, res));
    
    this.app.put('/api/v1/motos/:mac',(req, res) => this.motosController.updateMotoByMac(req, res));
    
    this.app.delete('/api/v1/motos/:mac', (req, res) => this.motosController.deleteMotoByMac(req, res));
    
    this.app.get('/api/v1/motos/:mac/image', (req, res) => this.motosController.getMotoImageByMac(req, res));

    this.app.get('/api/v1/motos/:mac/status', (req, res) => this.motosController.getMotoStatusByMac(req, res));

    this.app.put('/api/v1/motos/:mac/status', (req, res) => this.motosController.updateMotoStatusByMac(req, res));

    
    this.app.get('/api/v1/thefts', (req, res) => this.theftsController.getThefts(req, res));
    
    this.app.post('/api/v1/thefts/:motoMac', (req, res) => this.theftsController.insertTheftsByMac(req, res));
    
    this.app.delete('/api/v1/thefts/:id', (req, res) => this.theftsController.deleteTheftById(req, res));
    
    this.app.post('/api/v1/recoveries', (req, res) => this.recoveriesController.insertRecovery(req, res));
    
    this.app.delete('/api/v1/recoveries/:id', (req, res) => this.recoveriesController.deleteRecoveryById(req, res));

  }
}

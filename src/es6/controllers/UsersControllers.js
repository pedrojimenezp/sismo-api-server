'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';
import * as tokens from '../models/tokens';
import * as motos from '../models/motos';
import * as users from '../models/users';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';

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

  addAnUserMoto(req, res) {
    let response;
    let result;
    let self = this;
    if (req.body.mac) {
      co(function*() {
        let filter = {
          userId: req.user.id,
          mac: req.body.mac
        }
        let moto = yield motos.getMotosByFilter(self.connection, filter);
        if (!helpers.isEmpty(moto)) {
          response = {
            code: "409",
            type: APIConstants.CONFLICT,
            error: "This mac is already registered to this user"
          };
          res.status(409).send(response);
        } else {
          let newMoto = {
            userId: req.user.id,
            mac: req.body.mac,
            marca: "",
            placa: "",
            color: "",
            modelo: "",
            cilindraje: ""
          };
          if(req.body.placa) {
            newMoto.placa = req.body.placa;
          }
          if(req.body.color) {
            newMoto.color = req.body.color;
          }
          if(req.body.marca) {
            newMoto.marca = req.body.marca;
          }
          if(req.body.cilindraje) {
            newMoto.cilindraje = req.body.cilindraje;
          }
          if(req.body.modelo) {
            newMoto.modelo = req.body.modelo;
          }
          result = yield motos.insertMoto(self.connection, newMoto);
          let motoInserted = yield motos.getMotosById(self.connection, result.generated_keys[0]);
          response = {
            code: 201,
            motoAdded: motoInserted
          }
          res.status(201).send(response);
        }
      }).catch((error) => {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    } else {
      response = {
        code: "400",
        type: APIConstants.BAD_REQUEST,
        error: "You must to pass at least the mac associated to the moto in the body of the request"
      };
      res.status(400).send(response);
    }
  }

  getAllUserMotos(req, res) {
    let response;
    let result;
    let self = this;
    let filter = {
      userId: req.user.id
    };
    if (req.query.mac) {
      filter.mac = req.query.mac;
    }
    if (req.query.placa) {
      filter.placa = req.query.placa;
    }
    if (req.query.marca) {
      filter.marca = req.query.marca;
    }
    if (req.query.color) {
      filter.color = req.query.color;
    }
    if (req.query.cilindraje) {
      filter.cilindraje = req.query.cilindraje;
    }
    if (req.query.modelo) {
      filter.modelo = req.query.modelo;
    }
    co(function*() {
      let userMotos = yield motos.getMotosByFilter(self.connection, filter);
      response = {
        code: 200,
        motos: userMotos
      }
      res.status(201).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getAnUserMoto(req, res) {
    let response;
    let result;
    let self = this;
    let filter = {
      userId: req.user.id,
      mac: req.params.mac
    };
    co(function*() {
      let userMoto = yield motos.getMotosByFilter(self.connection, filter);
      if(helpers.isEmpty(userMoto)){
        response = {
          code: 200,
          moto: {}
        }
      }else{
        response = {
          code: 200,
          moto: userMoto[0]
        }
      }
      res.status(200).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateAnUserMoto(req, res) {
    let response;
    let result;
    let self = this;
    co(function*() {
      let filter = {
        userId: req.user.id,
        mac: req.params.mac
      }
      let moto = yield motos.getMotosByFilter(self.connection, filter);
      if (helpers.isEmpty(moto)) {
        response = {
          code: "409",
          type: APIConstants.CONFLICT,
          error: "This mac isn't registered to this user, the operation can't be done"
        };
        res.status(409).send(response);
      } else {
        moto = moto[0];
        if(req.body.placa) {
          moto.placa = req.body.placa;
        }
        if(req.body.color) {
          moto.color = req.body.color;
        }
        if(req.body.marca) {
          moto.marca = req.body.marca;
        }
        if(req.body.cilindraje) {
          moto.cilindraje = req.body.cilindraje;
        }
        if(req.body.modelo) {
          moto.modelo = req.body.modelo;
        }
        delete moto.id;
        delete moto.userId;
        result = yield motos.updateMoto(self.connection, filter, moto);
        let motoUpdated = yield motos.getMotosByFilter(self.connection, filter);
        response = {
          code: 200,
          motoUpdated: motoUpdated
        }
        res.status(201).send(response);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  _hasThisMoto(motos, mac) {
    let hasIt = false;
    if(motos.length > 0){
      let length = motos.length;
      console.log(length);
      for (let i=0; i<length; i++) {
        if(motos[i].mac === mac) {
          hasIt = true;
          break;
        }
      }
    }
    return hasIt;
  }
}

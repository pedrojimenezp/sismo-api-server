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
    let result;
    let response;
    co(function*() {
      result = yield users.getAllUsers(self.connection);
      response = {
        code: 200,
        users: result
      }
      res.status(response.code).send(response);
    }).catch((error) => {
      httpResponses.internalServerError(res);
    });
  }

  getUserByUsername(req, res) {
    let response;
    let result;
    let self = this;
    co(function*() {
      let user = yield users.getUserByUsername(self.connection, req.params.username);
      if (helpers.isEmpty(user)){
        httpResponses.notFound(res, "Username not found");
      } else{
        if(user.account) {
          delete user.account.password;
        }
        let filter = {
          userId: user.id
        }
        let userMotos = yield motos.getMotosByFilter(self.connection, filter);
        delete user.id;
        user.motos = userMotos;
        response = {
          code: 200,
          user: user
        }
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      httpResponses.internalServerError(res);
    });
  }

  createAnUser(req, res) {
    let response;
    let result;
    if (req.body.username && req.body.password) {
      const self = this;
      co(function*() {
        let usernameAlreadyExist = yield users.usernameAlreadyExist(self.connection, req.body.username);
        if (usernameAlreadyExist) {
          httpResponses.conflict(res, "Username already exist");
        } else {
          result = yield users.insertUser(self.connection, req.body.username, req.body.password);
          let userInserted = yield users.getUserById(self.connection, result.generated_keys[0]);
          let username = userInserted.account.username;
          delete userInserted.account.password;
          userInserted.profile = {};
          userInserted.motos = [];
          let scopes = {
            me: ["get", "post", "put", "delete"],
            others: ["get"]
          };
          result = yield tokens.createAnAccessToken(self.connection, username, scopes);
          let tokenInserted = yield tokens.getTokenById(self.connection, result.generated_keys[0]);
          response = {
            code: 201,
            userCreated: userInserted,
            accessToken: tokenInserted.accessToken,
            refreshToken: tokenInserted.refreshToken
          }
          res.status(response.code).send(response);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      httpResponses.internalServerError(res);
    }
  }

  updateUserProfile(req, res) {
    let response;
    let result;
    let self = this;
    co(function*() {
      let user = yield users.getUserById(self.connection, req.user.id);
      if (helpers.isEmpty(user)) {
        httpResponses.notFound(res, "Username not found");
      } else {
        let profile = {};
        if (user.profile) {
          profile = user.profile;
        }
        if(req.body.name) {
          profile.name = req.body.name;
        }
        if(req.body.age) {
          profile.age = req.body.age;
        }
        if(req.body.sex) {
          profile.sex = req.body.sex;
        }
        result = yield users.updateUserProfile(self.connection, req.user.id, profile);
        let userUpdated = yield users.getUserById(self.connection, req.user.id);
        let filter = {
          userId: user.id
        }
        let userMotos = yield motos.getMotosByFilter(self.connection, filter);
        delete userUpdated.account.password;
        delete userUpdated.id;
        userUpdated.motos = userMotos;
        response = {
          code: 200,
          userUpdated: userUpdated
        }
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      httpResponses.internalServerError(res);
    });
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
        let userMotos = yield motos.getMotosByFilter(self.connection, filter);
        console.log(userMotos);
        if (userMotos.length > 0) {
          httpResponses.conflict(res, "This mac is already registered to this user");
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
          res.status(response.code).send(response);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      httpResponses.badRequest(res, "You must to pass at least the mac associated to the moto in the body of the request");
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
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getAnUserMotoByMac(req, res) {
    let response;
    let result;
    let self = this;
    let filter = {
      userId: req.user.id,
      mac: req.params.mac
    };
    co(function*() {
      let userMoto = yield motos.getUserMotoByMac(self.connection, req.user.id, req.params.mac);
      if(helpers.isEmpty(userMoto)){
        httpResponses.notFound(res, "Mac not found");
      }else{
        response = {
          code: 200,
          moto: userMoto
        }
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateAnUserMotoByMac(req, res) {
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
        httpResponses.notFound(res, "Mac not found");
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
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  deleteAnUserMotoByMac(req, res) {
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
        httpResponses.notFound(res, "Mac not found");
      } else {
        result = yield motos.deleteMoto(self.connection, filter);
        response = {
          code: 200,
          motoDeleted: moto
        }
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
}

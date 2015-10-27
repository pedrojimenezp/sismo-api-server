'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

import * as usersModel from '../models/UsersModel';
import * as motosModel from '../models/MotosModel';
import * as tokensModel from '../models/TokensModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import fs from 'fs';

export default class UsersController {
  constructor(db){
    this.db = db;
  }

  getAllUsers(req, res) {
    console.log("-> callling function getAllUsers in UsersControllers");
    let self = this;
    let result;
    let response;
    co(function*() {
      result = yield usersModel.getAllUsers(self.db);
      response = {
        code: 200,
        users: result
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getUserByUsername(req, res) {
    console.log("-> calling function getUserByUsername in UsersControllers");
    let self = this;
    let response;
    let errorResponse;
    co(function*() {
      let user = yield usersModel.findUserByFilter(self.db, {'account.username': req.params.username});
      if (user){
        delete user._id;
        if(user.account) {
          delete user.account.password;
        }
        if (req.user.username === req.params.username) {
          let userMotos = yield motosModel.findMotosByFilter(self.db, {userId: user._id});
          user.motos = userMotos;
        }
        response = {
          code: 200,
          status: 'Ok',
          result: {
            user: user
          }
        };
        res.status(response.code).send(response);
      } else{
        errorResponse = {
          error: "Username not found",
          description: "The username you sent in the url doesn't exist in our db"
        };
        httpResponses.notFound(res, "Username not found");
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  createUser(req, res) {
    console.log("-> callling function createUser in UsersControllers");
    const self = this;
    let response;
    let result;
    let errorResponse;
    if (req.body.username && req.body.password) {
      co(function*() {
        let usernameAlreadyExist = yield usersModel.usernameAlreadyExist(self.db, req.body.username);
        if (usernameAlreadyExist) {
          errorResponse = {
            type: "Username already exist",
            description: "The the username you want to register is already registered in our db, you have to send another"
          };
          httpResponses.conflict(res, errorResponse);
        } else {
          let user = {
            account: {
              username: req.body.username,
              password: req.body.password
            }
          };
          result = yield usersModel.insertUser(self.db, user);
          let userInserted = result.ops[0];
          delete userInserted.account.password;
          userInserted.profile = {};
          userInserted.motos = [];
          let scopes = ["motos", "profile", "thefts", "recoveries", "logs"];
          let token = tokensModel.createTokenObject(userInserted._id, scopes);
          result = yield tokensModel.insertToken(self.db, token);
          let tokenInserted = result.ops[0];
          delete tokenInserted._id;
          delete tokenInserted.userId;
          response = {
            code: 201,
            userCreated: userInserted,
            tokens: tokenInserted
          };
          res.status(response.code).send(response);
          //res.send("ok");
        }
      }).catch((error) => {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    } else {
      httpResponses.badRequest(res, "You have to pass a username and password");
    }
  }
  
  /*updateUserProfile(req, res) {
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
        };
        let userMotos = yield motos.getMotosByFilter(self.connection, filter);
        delete userUpdated.account.password;
        delete userUpdated.id;
        userUpdated.motos = userMotos;
        response = {
          code: 200,
          userUpdated: userUpdated
        };
        res.status(response.code).send(response);
      }
    }).catch((error) => {
      httpResponses.internalServerError(res);
    });
  }*/

  addUserMoto(req, res) {
    console.log("-> callling function addUserMoto in UsersControllers");
    let self = this;
    let response;
    let result;
    let errorResponse;
    console.log(req.user);
    if (req.body.mac) {
      co(function*() {
        let filter = {
          userId: req.user.id,
          mac: req.body.mac
        };
        console.log(filter);
        let userMoto = yield motosModel.findMotoByFilter(self.db, filter);
        console.log(userMoto);
        if (!userMoto) {
          let newMoto = {
            userId: req.user.id,
            mac: req.body.mac,
            brand: "",
            line: "",
            model: 0,
            plate: "",
            color: "",
            cylinderCapacity: 0,
            image: "",
            imageEncodeType: "",
            status: {
              monitoring: "off",
              electricalFlow: "unlocked",
              safetyLock: "unlocked"
            }
          };
          if(req.body.brand) {
            newMoto.brand = req.body.brand;
          }
          if(req.body.line) {
            newMoto.line = req.body.line;
          }
          if(req.body.model) {
            newMoto.model = req.body.model;
          }
          if(req.body.plate) {
            newMoto.plate = req.body.plate;
          }
          if(req.body.color) {
            newMoto.color = req.body.color;
          }
          if(req.body.cylinderCapacity) {
            newMoto.cylinderCapacity = req.body.cylinderCapacity;
          }
          if(req.body.image) {
            newMoto.image = req.body.image;
          }
          if(req.body.imageEncodeType) {
            newMoto.imageEncodeType = req.body.imageEncodeType;
          }
          result = yield motosModel.insertMoto(self.db, newMoto);
          let motoInserted = result.ops[0];
          delete motoInserted.image;
          delete motoInserted.userId;
          delete motoInserted._id;
          response = {
            code: 201,
            status: 'Created',
            result: {
              moto: motoInserted
            }
          };
          res.status(response.code).send(response);
        } else {
          errorResponse = {
            error: "Mac already exist",
            description: "The the mac you want to register to this user is already registered i another moto of the same user, you have to send another"
          };
          httpResponses.conflict(res, errorResponse);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      errorResponse = {
        error: "Missing parameters",
        description: "You have to sent at least the mac associated to the moto in the body of the request"
      };
      httpResponses.badRequest(res, errorResponse);
    }
  }

  getAllUserMotos(req, res) {
    console.log("-> callling function getAllUserMotos in UsersControllers");
    let self = this;
    let response;
    let result;
    let filter = {
      userId: req.user.id
    };
    if (req.query.mac) {
      filter.mac = req.query.mac;
    }
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    if(req.query.line) {
      filter.line = req.query.line;
    }
    if (req.query.model) {
      filter.model = req.query.model;
    }
    if (req.query.plate) {
      filter.plate = req.query.plate;
    }
    if (req.query.color) {
      filter.color = req.query.color;
    }
    if (req.query.cylinderCapacity) {
      filter.cylinderCapacity = req.query.cylinderCapacity;
    }
    co(function*() {
      let userMotos = yield motosModel.findMotosByFilter(self.db, filter);
      response = {
        code: 200,
        status: 'Ok',
        result: {
          motos: userMotos
        }
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getUserMotoByMac(req, res) {
    console.log("-> callling function getUserMotoByMac in UsersControllers");
    let self = this;
    let response;
    let result;
    let errorResponse;
    let filter = {
      userId: req.user.id,
      mac: req.params.mac
    };
    co(function*() {
      let userMoto = yield motosModel.findMotoByFilter(self.db, filter);
      if(userMoto){
        if(req.query.image == "no"){
          delete userMoto.image;
        }
        response = {
          code: 200,
          status: 'Ok',
          result: {
            moto: userMoto
          }
        };
        res.status(response.code).send(userMoto);
      }else{
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getUserMotoImageByMac(req, res) {
    console.log("-> callling function getAnUserMotoImageByMac in UsersControllers");
    let self = this;
    let response;
    let result;
    let errorResponse;
    let filter = {
      userId: req.user.id,
      mac: req.params.mac
    };
    co(function*() {
      let userMoto = yield motosModel.findMotoByFilter(self.db, filter);
      if (userMoto) {
        var img = new Buffer(userMoto.image, 'base64');
        res.writeHead(200, {
          'Content-Type': "image/png",
          'Content-Length': img.length,
          'Content-Disposition' : 'inline; filename="'+userMoto.mac+'"'
        });
        res.write(img);
        res.end();
      }else{
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateUserMotoByMac(req, res) {
    console.log("-> callling function updateUserMotoByMac in UsersControllers"); 
    let self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let filter = {
        userId: req.user.id,
        mac: req.params.mac
      };
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if (moto) {
        if(req.body.mac) {
          moto.mac = req.body.mac;
        }
        if(req.body.brand) {
          moto.brand = req.body.brand;
        }
        if(req.body.line) {
          moto.line = req.body.line;
        }
        if(req.body.model) {
          moto.model = req.body.model;
        }
        if(req.body.plate) {
          moto.plate = req.body.plate;
        }
        if(req.body.color) {
          moto.color = req.body.color;
        }
        if(req.body.cylinderCapacity) {
          moto.cylinderCapacity = req.body.cylinderCapacity;
        }
        if(req.body.image) {
          moto.image = req.body.image;
        }
        if(req.body.imageEncodeType) {
          moto.imageEncodeType = req.body.imageEncodeType;
        }
        delete moto._id;
        delete moto.userId;
        result = yield motosModel.updateMotoByFilter(self.db, filter, moto);
        response = {
          code: 200,
          status: "Ok",
        };
        res.status(response.code).send(response);
      } else {
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  deleteUserMotoByMac(req, res) {
    console.log("-> callling function deleteUserMotoByMac in UsersControllers");    
    let self = this;
    let response;
    let errorResponse;
    let result;
    co(function*() {
      let filter = {
        userId: req.user.id,
        mac: req.params.mac
      };
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if (moto) {
        result = yield motosModel.deleteMotoByFilter(self.db, filter);
        response = {
          code: 200,
          status: 'Ok'
        };
        res.status(response.code).send(response);
      } else {
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateUserMotoStatusByMac(req, res) {
    console.log("-> callling function updateUserMotoStatusByMac in UsersControllers"); 
    let self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let filter = {
        userId: req.user.id,
        mac: req.params.mac
      };
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if (moto) {
        let dataToUpdate = {
          status: moto.status
        }
        if(req.body.monitoring) {
          dataToUpdate.status.monitoring = req.body.monitoring;
        }
        if(req.body.safetyLock) {
          dataToUpdate.status.safetyLock = req.body.safetyLock;
        }
        if(req.body.electricalFlow) {
          dataToUpdate.status.electricalFlow = req.body.electricalFlow;
        }
        result = yield motosModel.updateMotoByFilter(self.db, filter, dataToUpdate);
        response = {
          code: 200,
          status: "Ok",
        };
        res.status(response.code).send(response);
      } else {
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getUserMotoStatusByMac(req, res) {
    console.log("-> callling function getUserMotoStatusByMac in UsersControllers"); 
    let self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let filter = {
        userId: req.user.id,
        mac: req.params.mac
      };
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if (moto) {
        response = {
          code: 200,
          status: "Ok",
          result: {
            status: moto.status
          }
        };
        res.status(response.code).send(response);
      } else {
        errorResponse = {
          error: "Mac not found",
          description: "This user doesn't has any moto with this mac"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
}



'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';

import * as usersModel from '../models/UsersModel';
import * as motosModel from '../models/MotosModel';
import * as tokensModel from '../models/TokensModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import fs from 'fs';

export default class MotosController {
  constructor(db){
    this.db = db;
  }

  insertMoto(req, res) {
    console.log("-> callling function addUserMoto in MotosController");
    let self = this;
    let response;
    let result;
    let errorResponse;
    if (req.body.userId && req.body.mac) {
      co(function*() {
        let filter = {
          mac: req.body.mac
        };
        let moto = yield motosModel.findMotoByFilter(self.db, filter);
        if (!moto) {
          let newMoto = {
            userId: req.body.userId,
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
              safetyLock: "unlocked",
              electricalFlow: "unlocked"
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
            description: "The the mac you want to register already registered, you have to send another"
          };
          httpResponses.conflict(res, errorResponse);
        }
      }).catch((error) => {
        httpResponses.internalServerError(res);
      });
    } else {
      errorResponse = {
        error: "Missing parameters",
        description: "You have to sent at least the userId and the mac associated to the moto in the body of the request"
      };
      httpResponses.badRequest(res, errorResponse);
    }
  }

  getMotos(req, res) {
    console.log("-> callling function getAllMotos in MotosController");
    let self = this;
    let response;
    let result;
    let filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
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
    let projection = {};
    if(req.query.image == "no"){
      projection.image = 0;
    }
    co(function*() {
      let motos = yield motosModel.findMotosByFilter(self.db, filter, projection);
      response = {
        code: 200,
        status: 'Ok',
        result: {
          motos: motos
        }
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getMotoByMac(req, res) {
    console.log("-> callling function getMotoByMac in MotosController");
    let self = this;
    let response;
    let errorResponse;
    let filter = {
      mac: req.params.mac
    };
    co(function*() {
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if(moto){
        if(req.query.image == "no"){
          delete moto.image;
        }
        response = {
          code: 200,
          status: 'Ok',
          result: {
            moto: moto
          }
        };
        res.status(response.code).send(response);
      }else{
        errorResponse = {
          error: "Mac not found",
          description: "This mac doesn't exist"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  getMotoImageByMac(req, res) {
    console.log("-> callling function getAnUserMotoImageByMac in MotosController");
    let self = this;
    let response;
    let errorResponse;
    let filter = {
      mac: req.params.mac
    };
    co(function*() {
      let moto = yield motosModel.findMotoByFilter(self.db, filter);
      if (moto) {
        var img = new Buffer(moto.image, 'base64');
        res.writeHead(200, {
          'Content-Type': "image/png",
          'Content-Length': img.length,
          'Content-Disposition' : 'inline; filename="'+moto.mac+'"'
        });
        res.write(img);
        res.end();
      }else{
        errorResponse = {
          error: "Mac not found",
          description: "This mac doesn't exist"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateMotoByMac(req, res) {
    console.log("-> callling function updateUserMotoByMac in MotosController"); 
    let self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let filter = {
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
          description: "This mac doesn't exist"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  deleteMotoByMac(req, res) {
    console.log("-> callling function deleteUserMotoByMac in MotosController");    
    let self = this;
    let response;
    let errorResponse;
    let result;
    co(function*() {
      let filter = {
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
          description: "This mac doesn't exist"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateMotoStatusByMac(req, res) {
    console.log("-> callling function updateUserMotoMonitoringStatusByMac in MotosController"); 
    let self = this;
    let response;
    let result;
    let errorResponse;
    if(req.body.monitoringStatus && req.body.safetyLockStatus && req.body.electricalFlowStatus){
      co(function*() {
        let filter = {
          mac: req.params.mac
        };
        let moto = yield motosModel.findMotoByFilter(self.db, filter);
        if (moto) {
          let dataToUpdate = {
            status: {
              monitoring: req.body.monitoringStatus,
              safetyLock: req.body.safetyLockStatus,
              electricalFlow: req.body.electricalFlowStatus
            }
          };
          result = yield motosModel.updateMotoByFilter(self.db, filter, dataToUpdate);
          response = {
            code: 200,
            status: "Ok",
          };
          res.status(response.code).send(response);
        } else {
          errorResponse = {
            error: "Mac not found",
            description: "This mac doesn't exist"
          };
          httpResponses.notFound(res, errorResponse);
        }
      }).catch((error) => {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    }else{
      errorResponse = {
        error: "Missing parameters",
        description: "You have to sent the monitoringStatus, safetyLockStatus and the electricalFlowStatus of the moto in the body of the request"
      };
      httpResponses.badRequest(res, errorResponse);
    }
  }
}



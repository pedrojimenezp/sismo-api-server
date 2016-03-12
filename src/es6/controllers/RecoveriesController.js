'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';
import http from 'http';
import mongodb from 'mongodb';

let ObjectID = mongodb.ObjectID;

import * as theftsModel from '../models/TheftsModel';
import * as recoveriesModel from '../models/RecoveriesModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import fs from 'fs';

export default class RecoveriesController {
  constructor(db){
    this.db = db;
  }

  getRecoveries(req, res) {
    console.log("-> calling function getRecoveries in RecoveriesController");
    let self = this;
    let errorResponse;
    let filter = {};
    if(req.query.userId){
      filter["userId"] = req.query.userId;
    }
    co(function*() {
      let recoveries = yield recoveriesModel.findRecoveriesByFilter(self.db, filter);
      httpResponses.ok(res, {recoveries:recoveries});
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  deleteRecoveryById(req, res) {
    console.log("-> calling function deleteRecoveryById in RecoveriesController");
    let self = this;
    let errorResponse;
    let filter = {
      _id: new ObjectID(req.params.id)
    }
    co(function*() {
      let result = yield recoveriesModel.deleteRecoveriesByFilter(self.db, filter);
      httpResponses.ok(res, {result:result});
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
  
  insertRecovery(req, res) {
    console.log("-> callling function insertRecoveriesByTheftId in RecoveriesController");
    const self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let filter = {
        _id: new ObjectID(req.body.theftId)
      } 
      let theft = yield theftsModel.findTheftByFilter(self.db, filter);
      if (theft) {
        let recovery = {
          userId: req.body.userId,
          theftId: req.body.theftId,
          moto: theft.moto,
          location: {
            country: req.body.country,
            department: req.body.department,
            city: req.body.city,
            address: req.body.address
          },
          date: {
            year: req.body.year,
            month: req.body.month,
            day: req.body.day
          }
        }
        let result = yield recoveriesModel.insertRecovery(self.db, recovery);
        httpResponses.created(res, result.ops[0]);
      } else {
        errorResponse = {
          error: "theftId not found",
          description: "The id of the thefts you passed doesn't exist"
        };
        httpResponses.notFound(res, errorResponse);
      }
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
}



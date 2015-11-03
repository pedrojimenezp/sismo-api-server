'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';

import * as notificationsModel from '../models/NotificationsModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import fs from 'fs';

export default class NotificationsController {
  constructor(db){
    this.db = db;
  }

  getNotifications(req, res) {
    console.log("-> callling function getNotificationsByFilter in NotificationsControllers");
    let self = this;
    let result;
    let response;
    let filter = {};
    let limit = 10;

    if(req.query.userId){
      filter["userId"] = req.query.userId;
    }

    if(req.query.limit){
      limit = req.query.limit;;
    }

    co(function*() {
      result = yield notificationsModel.findNotificationsByFilter(self.db, filter, {date:1}, limit);
      response = {
        code: 200,
        result: {
          notifications: result
        }
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }


  insertNotification(req, res) {
    console.log("-> callling function createNotification in NotificationsControllers");
    const self = this;
    let response;
    let result;
    let errorResponse;
    let notification = {};
    if (req.body.userId) {
      notification["userId"] = req.body.userId;
    }
    if(req.body.motoMac){
      notification["motoMac"] = req.body.motoMac;  
    }
    if(req.body.subject){
      notification["subject"] = req.body.subject;  
    }
    notification["date"] = Date.now();
    notification["status"] = "unread";

    co(function*() {
      result = yield notificationsModel.insertNotification(self.db, notification);
      let notificationInserted = result.ops[0];
      response = {
        code: 201,
        notificationCreated: notificationInserted
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  updateNotificationStatusToRead(req, res) {
    console.log("-> callling function updateNotification in NotificationsControllers");
    const self = this;
    let response;
    let result;
    let errorResponse;
    let notification = {};
    co(function*() {
      result = notificationsModel.updateNotification(self.db, {_id:req.params.notificationId}, {status:"read"});
      response = {
        code: 201,
        result: result
      };
      res.status(response.code).send(response);
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
}
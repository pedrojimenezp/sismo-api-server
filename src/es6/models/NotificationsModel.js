import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import shortid  from 'shortid';

/*
Notifications have this info

notifications = {
  id: ObjectId,
  userId: ObjectId,
  motoMac: String,
  subject: String,
  date: Date,
  status: String 
}
*/

export function insertNotification(db, notification) {
  console.log("-> calling function insertNotification in NotificationsModel"); 
  return new Promise((resolve, reject) => {
    if (db && notification) {
      let notificationsCollection = db.collection('notifications');
      notificationsCollection.insert(notification, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to db and notification as parameters"
      };
      reject(error);
    }
  });
}

export function updateNotification(db, filter, dataToUpdate) {
  console.log("-> calling function updateNotification in NotificationsModel"); 
  return new Promise((resolve, reject) => {
    if (db && filter && dataToUpdate) {
      let notificationsCollection = db.collection('notifications');
      notificationsCollection.update(filter, {$set: dataToUpdate}, (error, result) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(result);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to db and notification as parameters"
      };
      reject(error);
    }
  });
}

export function findNotificationById(db, id) {
  console.log("-> calling function getNotificationsByFilter in NotificationsModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let notificationsCollection = db.collection('notifications');
      notificationsCollection.findOne({_id:id}, (error, notification) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(notification);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and an id as parameters"
      };
      reject(error);
    }
  });
}

export function findNotificationsByFilter(db, filter, sort, limit) {
  console.log("-> calling function getNotificationsByFilter in NotificationsModel");
  return new Promise((resolve, reject) => {
    if (db && filter) {
      let notificationsCollection = db.collection('notifications');
      notificationsCollection.find(filter).sort(sort).limit(limit).toArray((error, notifications) => {
        if(error){
          reject({type: APIConstants.DATABASE_ERROR, error: error});
        }else{
          resolve(notifications);
        }
      });
    } else {
      const error = {
        type: APIConstants.MISSING_PARAMETERS,
        error: "You need to pass a db and a filter as parameters"
      };
      reject(error);
    }
  });
}
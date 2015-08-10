'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';

//import APIEvents from '../events/APIEvents';
import MQTTClient from '../MQTTClient';


export default class UsersControllers {
  constructor(connection){
    this.connection = connection;
  }

  getUsers(req, res) {
    r.table('users').filter({}).run(this.connection, (error, result) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // console.log(result);
        res.send(result._responses);
      }
    });
  }

  getUserByUsername(req, res) {
    let filter = {
      account: {
        username: req.params.username
      }
    }
    r.table('users').filter({account: {username: req.params.username}}).run(this.connection, (error, result) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(result._responses);
        res.send(result._responses);
      }
    });
  }

  createAnUser(req, res) {
    if (req.body.username && req.body.email && req.body.password) {
      const self = this;
      co(function*() {
        let emailAlreadyEsist = yield self._emailAlreadyExist(req.body.email);
        if (emailAlreadyEsist) {
          res.send('Email already exist, write another one');
        } else {
          let usernameAlreadyExist = yield self._usernameAlreadyExist(req.body.username);
          if (usernameAlreadyExist) {
            res.send('Username already exist, write another one');
          } else {
            const user = {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password
            }
            let result = yield self._insertUser(user);
            MQTTClient.publish("APIEvents/NewUserRegistered", req.body.username);
            res.sendStatus(201);
          }
        }
      }).catch((error) => {
        res.send(error);
      });
    } else {
      res.send('You must to pass an email and password');
    }
  }

  _emailAlreadyExist(email) {
    return new Promise((resolve, reject) => {
      const self = this;
      co(function*() {
        let count = yield r.table('users').count((user) => {
          return user('account')('email').eq(email);
        }).run(self.connection);
        count === 0 ? resolve(false) : resolve(true);
      }).catch((error) => {
        reject({code: APIConstants.DATABASE_ERROR, error});
      });
    });
  }

  _usernameAlreadyExist(username, callback) {
    return new Promise((resolve, reject) => {
      const self = this;
      co(function*() {
        let count = yield r.db('sismo').table('users').count(function(user) {
          return user('account')('username').eq(username);
        }).run(self.connection);
        count === 0 ? resolve(false) : resolve(true);
      }).catch((error) => {
        reject({code: APIConstants.DATABASE_ERROR, error});
      });
    });
  }

  _insertUser({username, email, password}) {
    return new Promise((resolve, reject) => {
      if (username && email && password) {
        const self = this;
        co(function*() {
          let result = yield r.db('sismo').table('users').insert({account: {username, email, password}}).run(self.connection);
          resolve(result);
        }).catch((error) => {
          reject({code: APIConstants.DATABASE_ERROR, error});
        });
      } else {
        const error = {
          code: APIConstants.MISSING_PARAMETERS,
          error: ""
        };
        reject(error);
      }
    });
  }
}

'use strict';

import r from 'rethinkdb';
import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import jwt from 'jsonwebtoken';

//import MQTTClient from '../MQTTClient';

export default class UsersControllers {
  constructor(connection){
    this.connection = connection;
  }

  createSession(req, res) {
    if ((req.body.username || req.body.email) && req.body.password) {
      let self = this;
      co(function*() {
        let user = yield self._findUser(req.body.username, req.body.email, req.body.password);
        if (user) {
          if(user.account.password === req.body.password) {
            let APIAccessToken = jwt.sign({
              username: `${user.account.username}`,
              scope: 'Add some scopes'
            }, 'secret');

            let response = {
              status: {
                number: 201,
                code: APIConstants.LOGIN_SUCCESS
              },
              APIAccessToken: APIAccessToken
            }
            res.send(response);
          } else {
            res.send('Login unsuccess');
          }
        } else {
          res.send('Login unsuccess');
        }
      }).catch((error) => {
        res.send(error);
      });
    } else {
      res.send('You must to pass an username or email and a password');
    }
  }

  getMQTTToken(req, res) {
    let username = req.user.account.username;
    let MQTTToken = jwt.sign({
      username: `${username}`,
      clientType: 'app',
      subscribeChannelsAllowed: [`/apps/users/${username}`, '/motos/1'],
      publishChannelsAllowed: [`/apps/users/${username}`, '/motos/1'],
    }, 'secret');
    res.send({MQTTToken: MQTTToken});
  }


  _userExist(username, email, password) {
    return new Promise((resolve, reject) => {
      if ((username || email) && password) {
        const self = this;
        co(function*(){
          let getUser = yield r.db('sismo').table('users').filter((user) => {
            return user('account')('username').eq(username).or(user('account')('email').eq(email));
          }).run(self.connection);
          if (getUser._responses.length) {
            getUser._responses[0].r[0].account.password === password ? resolve(true) : resolve(false);
          } else {
            resolve(false);
          }
        }).catch((error) => {
          reject({code: APIConstants.DATABASE_ERROR, error});
        });
      } else {
        const error = {
          code: APIConstants.MISSING_PARAMETERS,
          error: 'This function requires a username or email parameter and a required password parameter'
        }
        reject(error);
      }
    });
  }

  _findUser(username, email, password) {
    return new Promise((resolve, reject) => {
      if ((username || email) && password) {
        const self = this;
        co(function*(){
          let getUser = yield r.db('sismo').table('users').filter((user) => {
            return user('account')('username').eq(username).or(user('account')('email').eq(email));
          }).run(self.connection);
          if (getUser._responses.length) {
            resolve(getUser._responses[0].r[0]);
          } else {
            resolve(null);
          }
        }).catch((error) => {
          reject({code: APIConstants.DATABASE_ERROR, error});
        });
      } else {
        const error = {
          code: APIConstants.MISSING_PARAMETERS,
          error: 'This function requires a username or email parameter and a required password parameter'
        }
        reject(error);
      }
    });
  }
}

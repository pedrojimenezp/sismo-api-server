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

export default class UsersController {
  constructor(db){
    this.db = db;
  }

  getUsers(req, res) {
    console.log("-> callling function getAllUsers in UsersControllers");
    let self = this;
    let result;
    let response;
    co(function*() {
      result = yield usersModel.findUsers(self.db);
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
        if(user.account) {
          delete user.account.password;
        }
        let userMotos = yield motosModel.findMotosByFilter(self.db, {userId: user._id});
        user.motos = userMotos;
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

  insertUser(req, res) {
    console.log("-> callling function insertUser in UsersControllers");
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
          response = {
            code: 201,
            user: userInserted
          };
          res.status(response.code).send(response);
        }
      }).catch((error) => {
        console.log(error);
        httpResponses.internalServerError(res);
      });
    } else {
      httpResponses.badRequest(res, "You have to pass a username and password");
    }
  }

  login(req, res){
    console.log("-> callling function createToken in TokensController");
    let self = this;
    let response;
    let result;
    let errorResponse;
    if(req.headers.authorization && req.headers.authorization !== ""){
      let authorization = req.headers.authorization.split(" ");
      if(authorization[0] === "Basic"){
        if(authorization[1] !== ""){
          let usernameAndPassword = new Buffer(authorization[1], 'base64').toString();
          let array = usernameAndPassword.split(":");
          if(array.length === 2){
            let username = array[0];
            let password = array[1];
            co(function*() {
              let user = yield usersModel.findUserByFilter(self.db, {'account.username': username});
              console.log(user);
              if (user && user.account.password === password) {
                delete user.account.password;
                response = {
                  user: user
                };
                httpResponses.Ok(res, response);
              } else {
                errorResponse = {
                  error: "Wrong username or password",
                  description: "The username or password you sent are incorrects"
                };
                httpResponses.unauthorized(res, errorResponse);
              }
            }).catch((error) => {
              httpResponses.internalServerError(res, error);
            });
          } else {
            errorResponse = {
              error: "Wrong username:password codification",
              description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
            };
            httpResponses.badRequest(res, errorResponse);
          }
        }else{
          errorResponse = {
            error: "Wrong format of Basic authentication method",
            description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
          };
          httpResponses.badRequest(res, errorResponse);
        }
      }else{
        errorResponse = {
          type: "Wrong format of Basic authentication method",
          description: "To use the Basic authentication you must to send username:password with base64 codification in the authentication header with Basic flag"
        }
        httpResponses.badRequest(res, errorResponse);
      }
    } else {
      errorResponse = {
        error: "Invalid authentication method",
        description: "To login you must to use the Basic authentication it means send username:password with base64 codification in the authentication header with Basic flag"
      }
      httpResponses.badRequest(res, errorResponse);
    }
  }
}



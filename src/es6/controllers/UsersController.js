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
      httpResponses.ok(res, {users:result});
    }).catch((error) => {
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
        httpResponses.ok(res, {user:user});
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
          httpResponses.created(res, {user:userInserted});
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
    console.log("-> callling function login in UsersController");
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
                httpResponses.ok(res, {user:user});
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

  login2(req, res){
    console.log("-> callling function login2 in UsersController");
    console.log(req.body);
    let self = this;
    let response;
    let result;
    let errorResponse;
    if(req.body.username && req.body.password){
      let username = req.body.username;
      let password = req.body.password;
      co(function*() {
        let user = yield usersModel.findUserByFilter(self.db, {'account.username': username});
        console.log(user);
        if (user && user.account.password === password) {
          if(req.body.rememberMe === "on"){
            res.cookie("isLogged",true);
            res.cookie("username",user.account.username);
            res.cookie("userId", user._id);
            console.log("Gurdado en cookies")
          }else{
            req.session["isLogged"] = true;
            req.session["username"] = user.account.username;
            req.session["userId"] = user._id;
            console.log("Gurdado en sessions")
          }
          res.redirect('/'+user.account.username+"/motos"); 
        } else {
          res.redirect('/signin?loginIncorrect=true&username='+req.body.username);
        }
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });
    }else{
      res.redirect('/signin?loginIncorrect=true&username='+req.body.username);
    }
  }
}



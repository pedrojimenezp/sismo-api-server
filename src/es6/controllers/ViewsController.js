'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';

import config from '../config/config';

import * as usersModel from '../models/UsersModel';
import * as motosModel from '../models/MotosModel';
import * as theftsModel from '../models/TheftsModel';
import * as recoveriesModel from '../models/RecoveriesModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';

import mongodb from 'mongodb';

let ObjectID = mongodb.ObjectID;

export default class ViewsControllers {
  constructor(db){
    this.db = db;
  }

  renderIndex (req, res) {
    console.log(req.session);
    console.log(req.cookies);
    if(req.session && (req.session.isLogged === true || req.session.isLogged === "true")){
      console.log("session: " +req.session);
      res.redirect('/'+req.session.username+'/motos');
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      console.log("cookies: "+req.cookies);
      res.redirect('/'+req.cookies.username+'/motos');
    }else{
      res.render("index.html");
    }
  }

  renderThefts(req, res) {
    console.log("-> calling function renderThefts in ViewsController"); 
    let self = this;
    
    console.log(JSON.stringify(req.query));

    let filter = {};
    
    if(req.query.theftId){
      filter["_id"] = new ObjectID(req.query.theftId);
    }
    /*if(req.query.brand){
      filter["moto.brand"] = req.query.brand;
    }*/

    let skip = 0;
    if(req.query.skip){
      skip = parseInt(req.query.skip);
    }

    let limit = 10;
    if(req.query.limit){
      limit = parseInt(req.query.limit);
    }
    co(function*() {
      let thefts = yield theftsModel.findTheftsByFilter(self.db, filter, {}, skip, limit);
      
      let count = 0;
      thefts.forEach(function(theft, i) {
        theft.id = theft._id.toString();
        count++;
      });
      res.render('thefts.html', {thefts: thefts, skip: skip, count: count, params: JSON.stringify(req.query)});
    }).catch((error) => {
      console.log(error);
      res.render("error.html");
    });
  }

  renderRecoveries(req, res) {
    console.log("-> calling function renderRecoveries in ViewsController"); 
    let self = this;
    let go = false;
    let userId;
    let filter = {};
    
    let skip = 0;
    if(req.query.skip){
      skip = parseInt(req.query.skip);
    }

    let limit = 10;
    if(req.query.limit){
      limit = parseInt(req.query.limit);
    }

    co(function*() {
      let recoveries = yield recoveriesModel.findRecoveriesByFilter(self.db, filter, {}, skip, limit);
      let count = 0;
      recoveries.forEach((recovery)=>{
        recovery.id = recovery._id.toString();
        count++;
      });
      console.log(recoveries);
      res.render('recoveries.html', {recoveries: recoveries, skip: skip, count: count});
    }).catch((error) => {
      console.log(error);
      res.render("error.html");
    });
  }

  renderSignin(req, res) {
    if(req.session && (req.session.isLogged === true || req.session.isLogged === "true")){
      console.log("session: " +req.session);
      res.redirect('/'+req.session.username+'/motos');
    }else if(req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged === "true")){
      console.log("cookies: "+req.cookies);
      res.redirect('/'+req.cookies.username+'/motos');
    }else{
      let params = {};
      if(req.query.username){
        params["username"] = req.query.username;
      }
      if(req.query.loginIncorrect){
        params["loginIncorrect"] = req.query.loginIncorrect;
      }
      res.render("signin.html", params);
    }
    
  }

  renderSignup(req, res){
    if(req.session && (req.session.isLogged === true || req.session.isLogged === "true")){
      console.log("session: " +req.session);
      res.redirect('/'+req.session.username+'/motos');
    }else if(req.cookies && (req.cookies.isLogged == true || req.cookies.isLogged === "true")){
      console.log("cookies: "+req.cookies);
      res.redirect('/'+req.cookies.username+'/motos');
    }else{
      res.render("signup.html");
    }
  }

  renderError(req, res) {
    res.render("error.html");
  }

  renderUserMotos(req, res) {
    console.log("-> calling function renderUserMotos in TheftsController"); 
    let self = this;
    let go = false;
    let userId;
    if(req.session && (req.session.isLogged === true || req.session.isLogged === "true")){
      if(req.session.username === req.params.username){
        go = true;
        userId = req.session.userId;
      }
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      if(req.cookies.username === req.params.username){
        go = true;
        userId = req.cookies.userId;
      }
    }  
    if(go){
      co(function*(){
        let motos = yield motosModel.findMotosByFilter(self.db, {userId:userId}, {image:0});
        res.render('motos.html', {username:req.params.username, motos: motos, userId: userId});
      }).catch((error) => {
        console.log(error);
        res.render("error.html");
      }); 
    }else{
      res.redirect('/');
    }
  }

  renderUserThefts(req, res) {
    console.log("-> calling function renderUserThefts in TheftsController"); 
    let self = this;
    let go = false;
    let userId;
    if(req.session && (req.session.isLogged == true || req.session.isLogged === "true")){
      if(req.session.username === req.params.username){
        go = true;
        userId = req.session.userId;
      }
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      if(req.cookies.username === req.params.username){
        go = true;
        userId = req.cookies.userId;
      }
    }
    if(go){
      console.log(JSON.stringify(req.query));

      let filter = {};
      filter["userId"] = userId;
      
      if(req.query.theftId){
        filter["_id"] = new ObjectID(req.query.theftId);
      }
      /*if(req.query.brand){
        filter["moto.brand"] = req.query.brand;
      }*/

      let skip = 0;
      if(req.query.skip){
        skip = parseInt(req.query.skip);
      }

      let limit = 10;
      if(req.query.limit){
        limit = parseInt(req.query.limit);
      }
      co(function*() {
        let thefts = yield theftsModel.findTheftsByFilter(self.db, filter, {}, skip, limit);
        
        let count = 0;
        thefts.forEach(function(theft, i) {
          theft.id = theft._id.toString();
          count++;
        });
        res.render('userThefts.html', {username:req.params.username, thefts: thefts, userId: userId, skip: skip, count: count, params: JSON.stringify(req.query)});
      }).catch((error) => {
        console.log(error);
        res.render("error.html");
      });
    }else{
      res.redirect('/');
    }
  }

  renderUpdateUserMotos(req, res) {
    let self = this;
    let go = false;
    let userId;
    if(req.session && (req.session.isLogged == true || req.session.isLogged === "true")){
      if(req.session.username === req.params.username){
        go = true;
        userId = req.session.userId;
      }
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      if(req.cookies.username === req.params.username){
        go = true;
        userId = req.cookies.userId;
      }
    }  
    if(go){
      var moto = {};
      moto.mac = req.params.mac;
      if(req.query.brand){
        moto.brand = req.query.brand;
      }
      if(req.query.line){
        moto.line = req.query.line;
      }
      if(req.query.cylinderCapacity){
        moto.cylinderCapacity = req.query.cylinderCapacity;
      }
      if(req.query.model){
        moto.model = req.query.model;
      }
      if(req.query.plate){
        moto.plate = req.query.plate;
      }
      if(req.query.color){
        moto.color = req.query.color;
      }
      res.render('motosUpdate.html', {username:req.params.username, userId: userId, moto: moto});
    }else{
      res.redirect('/');
    }
  }

  renderUserRecoveries(req, res) {
    console.log("-> calling function renderUserRecoveries in TheftsController"); 
    let self = this;
    let go = false;
    let userId;
    if(req.session && (req.session.isLogged == true || req.session.isLogged === "true")){
      if(req.session.username === req.params.username){
        go = true;
        userId = req.session.userId;
      }
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      if(req.cookies.username === req.params.username){
        go = true;
        userId = req.cookies.userId;
      }
    }
    if(go){
      let filter = {};
      filter["userId"] = userId;
      
      let skip = 0;
      if(req.query.skip){
        skip = parseInt(req.query.skip);
      }

      console.log(typeof skip);

      let limit = 10;
      if(req.query.limit){
        limit = parseInt(req.query.limit);
      }

      co(function*() {
        let recoveries = yield recoveriesModel.findRecoveriesByFilter(self.db, filter, {}, skip, limit);
        let count = 0;
        recoveries.forEach((recovery)=>{
          recovery.id = recovery._id.toString();
          count++;
        });
        console.log(recoveries);
        res.render('userRecoveries.html', {username:req.params.username, recoveries: recoveries, userId: userId, skip: skip, count: count});
      }).catch((error) => {
        console.log(error);
        res.render("error.html");
      });
    }else{
      res.redirect('/');
    }
  }

  renderAddUserRecoveries(req, res) {
    let self = this;
    let go = false;
    let userId;
    if(req.session && (req.session.isLogged == true || req.session.isLogged === "true")){
      if(req.session.username === req.params.username){
        go = true;
        userId = req.session.userId;
      }
    }else if(req.cookies && (req.cookies.isLogged === true || req.cookies.isLogged === "true")){
      if(req.cookies.username === req.params.username){
        go = true;
        userId = req.cookies.userId;
      }
    }
    if(go){
      res.render('addRecovery.html', {username:req.params.username, userId: userId, theftId: req.query.theftId});
    }else{
      res.redirect('/');
    }
  }
}


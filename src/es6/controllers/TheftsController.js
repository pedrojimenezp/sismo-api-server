'use strict';

import APIConstants from '../constants/APIConstants';
import co from 'co';
import polyfill from 'babel/polyfill';
import config from '../config/config';
import shortid  from 'shortid';
import http from 'http';
import mongodb from 'mongodb';

let ObjectID = mongodb.ObjectID;

import * as motosModel from '../models/MotosModel';
import * as theftsModel from '../models/TheftsModel';
import * as httpResponses from '../helpers/httpResponses';
import * as helpers from '../helpers/helpers';
import fs from 'fs';

export default class TheftsController {
  constructor(db){
    this.db = db;
  }

  getThefts(req, res) {
    console.log("-> calling function getThefts in TheftsController");
    let self = this;
    let errorResponse;
    let filter = {};
    if(req.query.userId){
      filter["userId"] = new ObjectID(req.query.userId);
    }
    co(function*() {
      let thefts = yield theftsModel.findTheftsByFilter(self.db, filter);
      httpResponses.ok(res, {thefts:thefts});
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }

  deleteTheftById(req, res) {
    console.log("-> calling function deleteTheftById in TheftsController");
    let self = this;
    let errorResponse;
    let filter = {
      _id: new ObjectID(req.params.id)
    }
    co(function*() {
      let thefts = yield theftsModel.deleteTheftsByFilter(self.db, filter);
      httpResponses.ok(res, {thefts:thefts});
    }).catch((error) => {
      console.log(error);
      httpResponses.internalServerError(res);
    });
  }
  
  insertTheftsByMac(req, res) {
    console.log("-> callling function insertTheftsByMac in TheftsController");
    const self = this;
    let response;
    let result;
    let errorResponse;
    co(function*() {
      let moto = yield motosModel.findMotoByFilter(self.db, {mac:req.params.motoMac});
      delete moto.image;
      console.log(moto);
      if (moto) {
        let pLat = 0;
        let pLon = 0;
        if(moto.status.parkingLatitude){
          pLat = moto.status.parkingLatitude;
        }
        if(moto.status.parkingLongitude){
          pLon = moto.status.parkingLongitude;
        }

        var options = {
          host: 'maps.googleapis.com',
          path: `/maps/api/geocode/json?latlng=${pLat},${pLon}`
        };

        http.request(options, (response) => {
          var str = '';
          response.on('data', function (chunk) {
            str += chunk;
          });
          response.on('end', function () {
            let data = JSON.parse(str);
            let country, department, city, address;
            console.log(data);
            if(data.results.length > 0){
              data.results[0].address_components.forEach((c)=>{
                if(c.types.indexOf("country") != -1){
                  country = c.long_name;
                }else if(c.types.indexOf("administrative_area_level_1") != -1){
                  department = c.long_name;
                }else if(c.types.indexOf("administrative_area_level_2")  != -1){
                  city = c.long_name;
                }
              });
              address = data.results[0].formatted_address.split(",")[0];

              let location = {
                latitude: moto.status.parkingLatitude,
                longitude: moto.status.parkingLongitude,
                country: country,
                department: department,
                city: city,
                address: address
              }

              let now = new Date();
              let date = {
                day: now.getUTCDate(),
                month: now.getUTCMonth() + 1,
                year: now.getUTCFullYear()
              };

              let theft = {
                userId: moto.userId,
                moto: {
                  mc: moto.mac,
                  brand: moto.brand,
                  line: moto.line,
                  model: moto.model,
                  plate: moto.plate,
                  color: moto.color,
                  cylinderCapacity: moto.cylinderCapacity
                },
                location: location,
                date: date
              };
              co(function*() {
                let result = yield theftsModel.insertTheft(self.db, theft);
                console.log(result);
                httpResponses.created(res, result.ops[0]);
              }).catch((error) => {
                console.log(error);
                httpResponses.internalServerError(res);
              });
            }else{
              errorResponse = {
                error: "Wrong parking position",
                description: "The last parking position of the moto isn't returned a valid location"
              };
              httpResponses.badRequest(res, errorResponse);
            }
          });
        }).end();
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

}



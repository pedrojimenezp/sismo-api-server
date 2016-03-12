/// <reference path="../../typings/node/node.d.ts"/>

"use strict";

import express from 'express';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import swig from 'swig';
import MongoClient from 'mongodb';
import multipart from 'connect-multiparty';
import ApiRoutes from './routes/ApiRoutes';
//import MQTTClient from './MQTTClient';


const app = express();
const multipartMiddleware = multipart();
/*
  USING SOME MIDDLEWARES
*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(multipartMiddleware);
app.use(session({secret: 'secret',cookie: {}}));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, '/../../client/static')));
//app.use('/static', express.static('public'));


/*
  USING SWIG ENGINE
*/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../../client/views');

app.set('view cache', true);
swig.setDefaults({ cache: true });

/*
  CONNECT TO RETHINKDB
*/

let options = {
  host: 'localhost',
  port: 28015,
  db: 'sismo'
};

//let mongodbUrl = 'mongodb://localhost:27017/sismo';
let mongodbUrl = 'mongodb://admin:1q2w3e4r@ds031098.mongolab.com:31098/sismo-api';

MongoClient.connect(mongodbUrl, function(error, db) {
  if(error){
    console.log(error);
    console.log(`Error trying to connect to SisMo database on ${mongodbUrl}`);
  }else{
    console.log("Connected correctly to server.");

    new ApiRoutes(app, db);

    let port = process.env.PORT || '4000';
    app.set('port', port);

    let server = http.createServer(app);

    server.listen(port);
    server.on('error', function(error) {
      console.error(error);
    });

    server.on('listening', function() {
      console.log(`HTTP server is listening in localhost:${port}`);
    });
  }
});
/*
let db;
new ApiRoutes(app, db);

  let port = process.env.PORT || '4000';
  app.set('port', port);

  let server = http.createServer(app);

  server.listen(port);
  server.on('error', function(error) {
    console.error(error);
  });

  server.on('listening', function() {
    console.log(`HTTP server is listening in localhost:${port}`);
  });*/
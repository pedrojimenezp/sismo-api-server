/// <reference path="../../typings/node/node.d.ts"/>

"use strict";

import express from 'express';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swig from 'swig';
import r from 'rethinkdb';

import ApiRoutes from './routes/ApiRoutes';
//import MQTTClient from './MQTTClient';


const app = express();

/*
  USING SOME MIDDLEWARES
*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, '/../client/static')));
//app.use('/static', express.static('public'));


/*
  USING SWIG ENGINE
*/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../client/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

/*
  CONNECT TO RETHINKDB
*/

let options = {
  host: 'localhost',
  port: 28015,
  db: 'sismo'
};

r.connect(options)
.then((connection) => {
  console.log(`Connected to ${options.db} database rethinkdb on http://${options.host}:${options.port}.`);

  new ApiRoutes(app, connection);

  let port = process.env.PORT || '3000';
  app.set('port', port);

  let server = http.createServer(app);

  server.listen(port);
  server.on('error', function(error) {
    console.error(error);
  });

  server.on('listening', function() {
    console.log(`HTTP server is listening in localhost:${port}`);
  });
})
.catch((error) => {
  console.log(error);
  if(error.name === 'RqlDriverError'){
    console.log(`Error trying to connect to ${options.db} database rethinkdb on http://${options.localhost}:${options.port}.`);
  }
});



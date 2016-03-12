'use strict';

import APIConstants from '../constants/APIConstants';

let dev = true;

export function ok(res, result){
  let response = {
    code: 200,
    status: 'Ok',
    result: result
  };
  res.status(response.code).send(response);
}

export function created(res, result){
  let response = {
    code: 201,
    status: 'Created',
    result: result
  };
  res.status(response.code).send(response);
}

export function internalServerError(res, error){
  console.log(error);
  let response = {
    code: 500,
    status: 'Internal server error',
    error: "Something bad just happened"
  };
  res.status(response.code).send(response);
}

export function badRequest(res, error) {
  console.log(error);
  let response = {
    code: 400,
    status: 'Bad request',
    error: error
  };
  res.status(response.code).send(response);
}

export function unauthorized(res, error) {
  console.log(error);
  let response = {
    code: 401,
    status: 'Unauthorized',
    error: error
  };
  res.status(response.code).send(response);
}

export function notFound(res, error) {
  console.log(error);
  let response = {
    code: 404,
    status: 'Not found',
    error: error
  };
  res.status(response.code).send(response);
}

export function conflict(res, error) {
  console.log(error);
  let response = {
    code: 409,
    status: 'Conflict',
    error: error
  };
  res.status(response.code).send(response);
}

'use strict';

import APIConstants from '../constants/APIConstants';


export function internalServerError(res){
  let response = {
    code: 500,
    type: APIConstants.INTERNAL_SERVER_ERROR,
    error: "Something bad just happened"
  };
  res.status(response.code).send(response);
}

export function badRequest(res, error) {
  let response = {
    code: 400,
    type: APIConstants.BAD_REQUEST,
    error: error
  }
  res.status(response.code).send(response);
}

export function unauthorized(res, error) {
  let response = {
    code: 401,
    type: APIConstants.UNAUTHORIZED,
    error: error
  }
  res.status(response.code).send(response);
}

export function notFound(res, error) {
  let response = {
    code: 404,
    type: APIConstants.NOT_FOUND,
    error: error
  }
  console.log(response);
  res.status(response.code).send(response);
}

export function conflict(res, error) {
  let response = {
    code: 409,
    type: APIConstants.CONFLICT,
    error: error
  };
  res.status(response.code).send(response);
}

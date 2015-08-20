'use strict';

import * as httpResponses from './httpResponses';

export function isEmpty(obj){
  return (Object.getOwnPropertyNames(obj).length === 0);
}

export function  responseToAnError(res, error) {
  if(error.name === "JsonWebTokenError"){
    httpResponses.badRequest(res, "The access-token is invalild");
  } else if(error.name === "TokenExpiredError") {
    httpResponses.unauthorized(res, "The access-token has expired");
  } else{
    httpResponses.internalServerError(res);
  }
}

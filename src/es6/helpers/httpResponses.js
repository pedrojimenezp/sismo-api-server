'use strict';

import APIConstants from '../constants/APIConstants';


export function internalServerError(res){
  let response = {
    code: "500",
    type: APIConstants.INTERNAL_SERVER_ERROR,
    error: "Something bad just happened"
  };
  res.status(500).send(response);
}

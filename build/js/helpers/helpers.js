'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isEmpty = isEmpty;
exports.responseToAnError = responseToAnError;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _httpResponses = require('./httpResponses');

var httpResponses = _interopRequireWildcard(_httpResponses);

function isEmpty(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}

function responseToAnError(res, error) {
  if (error.name === "JsonWebTokenError") {
    httpResponses.badRequest(res, "The access-token is invalild");
  } else if (error.name === "TokenExpiredError") {
    httpResponses.unauthorized(res, "The access-token has expired");
  } else {
    httpResponses.internalServerError(res);
  }
}
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ok = ok;
exports.created = created;
exports.internalServerError = internalServerError;
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
exports.notFound = notFound;
exports.conflict = conflict;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constantsAPIConstants = require('../constants/APIConstants');

var _constantsAPIConstants2 = _interopRequireDefault(_constantsAPIConstants);

var dev = true;

function ok(res, result) {
  var response = {
    code: 200,
    status: 'Ok',
    result: result
  };
  res.status(response.code).send(response);
}

function created(res, result) {
  var response = {
    code: 201,
    status: 'Created',
    result: result
  };
  res.status(response.code).send(response);
}

function internalServerError(res, error) {
  console.log(error);
  var response = {
    code: 500,
    status: 'Internal server error',
    error: "Something bad just happened"
  };
  res.status(response.code).send(response);
}

function badRequest(res, error) {
  console.log(error);
  var response = {
    code: 400,
    status: 'Bad request',
    error: error
  };
  res.status(response.code).send(response);
}

function unauthorized(res, error) {
  console.log(error);
  var response = {
    code: 401,
    status: 'Unauthorized',
    error: error
  };
  res.status(response.code).send(response);
}

function notFound(res, error) {
  console.log(error);
  var response = {
    code: 404,
    status: 'Not found',
    error: error
  };
  res.status(response.code).send(response);
}

function conflict(res, error) {
  console.log(error);
  var response = {
    code: 409,
    status: 'Conflict',
    error: error
  };
  res.status(response.code).send(response);
}
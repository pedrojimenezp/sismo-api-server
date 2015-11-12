'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mqtt = require('mqtt');

var _mqtt2 = _interopRequireDefault(_mqtt);

var _configConfig = require('./config/config');

var _configConfig2 = _interopRequireDefault(_configConfig);

var MQTTClient = _mqtt2['default'].connect('mqtt://localhost:5000', { username: _configConfig2['default'].mqtt.username, password: token });

MQTTClient.on('connect', function () {
  console.log('Connected to MQTT server');
});

MQTTClient.on('error', function (error) {
  console.log(error);
});

exports['default'] = MQTTClient;
module.exports = exports['default'];
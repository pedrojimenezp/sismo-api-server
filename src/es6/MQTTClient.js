import mqtt from 'mqtt';
import jwt from 'jsonwebtoken';

import config from './config/config';

let token = jwt.sign({
  username: config.mqtt.username,
  clientType: 'app',
  subscribeChannelsAllowed: [],
  publishChannelsAllowed: ['apps/users/+[a-zA-Z0-9]+', 'motos/+[a-zA-Z0-9]+'],
}, config.mqtt.secret);

const MQTTClient = mqtt.connect('mqtt://localhost:5000', {username: config.mqtt.username, password: token});


MQTTClient.on('connect', () => {
  console.log('Connected to MQTT server');
});

MQTTClient.on('error', (error) => {
  console.log(error);
});

export default MQTTClient;

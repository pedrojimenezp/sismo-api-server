import mqtt from 'mqtt';

import config from './config/config';

const MQTTClient = mqtt.connect('mqtt://localhost:5000', {username: config.mqtt.username, password: token});


MQTTClient.on('connect', () => {
  console.log('Connected to MQTT server');
});

MQTTClient.on('error', (error) => {
  console.log(error);
});

export default MQTTClient;

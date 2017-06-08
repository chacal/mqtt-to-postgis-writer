import mqtt = require('mqtt')
import process = require('process')
import Bacon = require('baconjs')
import EventStream = Bacon.EventStream
import Client = mqtt.Client
import { SignalKDelta } from './domain'
import { writeToPostGIS } from "./PostGisWriter"

// Declare fromEvent() version thas is used with MQTT message handler
declare module 'baconjs' {
  function fromEvent<E, A>(target: EventTarget|NodeJS.EventEmitter|JQuery, eventName: string, eventTransformer: (t: string, m: string) => A): EventStream<E, A>;
}


const MQTT_BROKER = process.env.MQTT_BROKER ? process.env.MQTT_BROKER : 'mqtt://localhost'
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD


startMqttClient(MQTT_BROKER, MQTT_USERNAME, MQTT_PASSWORD)
  .flatMapLatest(mqttClient => {
    mqttClient.subscribe('signalk/delta', {qos: 1})
    return Bacon.fromEvent(mqttClient, 'message', signalKDeltaFromMQTTMessage)
  })
  .onValue(writeToPostGIS)


function startMqttClient<A>(brokerUrl: string, username: string, password: string): EventStream<A, Client> {
  const client = mqtt.connect(brokerUrl, { username, password })
  client.on('connect', () => console.log('Connected to MQTT server'))
  client.on('offline', () => console.log('Disconnected from MQTT server'))
  client.on('error', (e) => console.log('MQTT client error', e))

  return Bacon.fromEvent(client, 'connect').first()
    .map(() => client)
}

function signalKDeltaFromMQTTMessage(topic: string, message: string): SignalKDelta {
  return JSON.parse(message) as SignalKDelta
}

# mqtt-to-postgis-writer
MQTT client that reads SignalK data from MQTT broker and writes it to PostGIS DB

1. Create DB with `db/create_schema.sql`
1. Set the following environment variables if needed
    * MQTT_BROKER (defaults to `mqtt://localhost`)
    * MQTT_USERNAME (defaults to empty)
    * MQTT_PASSWORD (defaults to empty)
    * DB_HOST (defaults to `localhost`)
    * DB_PORT (defaults 5432)
    * DB_NAME (defaults to `signalk`)
    * DB_USER (defaults to `postgres`)
    * DB_PASSWD (defaults to empty)
1. Run `npm install`
2. Run `npm start`

import process = require('process')
import {IDatabase, IMain} from 'pg-promise'
import * as PgPromise from 'pg-promise'
import * as Bluebird from 'bluebird'
import {SignalKDelta, SignalKUpdate, SignalKValue} from "./Domain"

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'signalk',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWD
}

const pgp: IMain = PgPromise({promiseLib: Bluebird})
const db: IDatabase<any> = pgp(dbConfig)

export function writeToPostGIS(delta: SignalKDelta) {
  return delta.updates.map(insertPositionsFromUpdate)

  function insertPositionsFromUpdate(positionUpdate: SignalKUpdate) {
    return positionUpdate.values.map(insertPosition)

    function insertPosition(position: SignalKValue) {
      if(position.path === 'navigation.position') {
        return db.query(`
            INSERT INTO track (vessel_id, timestamp, point)
            VALUES ($1, $2, st_point($3, $4))
            ON CONFLICT (vessel_id, timestamp)
            DO UPDATE SET point = st_point($3, $4)
          `,
          [stripVesselsPrefix(delta.context), positionUpdate.timestamp, position.value.longitude, position.value.latitude])
          .catch(e => console.error(`Failed to write position to DB! Complete input data: ${JSON.stringify(delta)} Position: ${JSON.stringify(position)}`, e))
      } else {
        console.log(`Received unknown input data: ${JSON.stringify(delta)}`)
        return undefined
      }

      function stripVesselsPrefix(deltaContext: string): string {
        return deltaContext.startsWith('vessels.') ? deltaContext.replace(/^vessels\./, '') : deltaContext
      }
    }
  }
}

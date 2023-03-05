import { Database, SQLite3Connector } from 'denodb/mod.ts'
import { Pilot } from './Models/Pilot.ts'
import { Aircraft } from './Models/Aircraft.ts'
import { Flight } from './Models/Flight.ts'

const connector = new SQLite3Connector({
	filepath: 'db/flight-database.sqlite',
})

export const db = new Database(connector)

export async function doTheDatabase() {
	db.link([Flight, Pilot, Aircraft])
	await db.sync()
}

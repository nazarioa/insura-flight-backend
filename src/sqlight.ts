import { Database, SQLite3Connector } from './deps.ts'
import { Aircraft, Flight, Pilot } from './models.ts'

const connector = new SQLite3Connector({
	filepath: 'db/flight-database.sqlite',
})

export const db = new Database(connector)

export async function doTheDatabase() {
	db.link([Flight, Pilot, Aircraft])
	await db.sync()
}

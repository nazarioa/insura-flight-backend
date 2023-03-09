import {
  Database,
  MySQLConnector,
  type MySQLOptions,
  SQLite3Connector,
  type SQLite3Options,
} from 'denodb';
import { Pilot } from './Models/Pilot.ts';
import { Aircraft } from './Models/Aircraft.ts';
import { Flight } from './Models/Flight.ts';
import { parse } from 'https://deno.land/std@0.178.0/flags/mod.ts';

export async function doTheDatabase(
  connectionType: 'mysql' | 'sqlite3',
  connectionDetails: MySQLOptions | SQLite3Options,
) {
  let db = null;

  if (connectionType === 'mysql') {
    db = new Database(
      new MySQLConnector(connectionDetails),
    );
  } else {
    db = new Database(
      new SQLite3Connector(connectionDetails),
    );
    await db.sync();
  }
  db.link([Flight, Pilot, Aircraft]);
}

export function getConnectionDetails(): {
  connectionType: 'sqlite3' | 'mysql';
  connectionDetails: MySQLOptions | SQLite3Options;
} {
  const args = parse(Deno.args);
  const env = Deno.env.get('DB_ENV') || args?.DB_ENV || 'local';

  if (env === 'stage') {
    return {
      connectionType: 'mysql',
      connectionDetails: {
        database: Deno.env.get('DB_NAME') || args?.DB_NAME || '',
        host: Deno.env.get('DB_HOST') || args?.DB_HOST || '',
        password: Deno.env.get('DB_PASSWORD') || args?.DB_PASSWORD || '',
        username: Deno.env.get('DB_USERNAME') || args?.DB_USERNAME || '',
        port: Deno.env.get('DB_PORT') || args?.DB_PORT || 3306,
      },
    };
  } else {
    return {
      connectionType: 'sqlite3',
      connectionDetails: {
        filepath: 'db/flight-database.sqlite',
      },
    };
  }
}

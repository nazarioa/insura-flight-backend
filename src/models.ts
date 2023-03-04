import { DataTypes, Model } from './deps.ts'

export class Pilot extends Model {
	static table = 'pilots'
	static timestamps = true
	static fields = {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		firstName: {
			type: DataTypes.STRING,
			length: 25,
		},
		lastName: {
			type: DataTypes.STRING,
			length: 25,
		},
	}
}

export class Aircraft extends Model {
	static table = 'aircraft'
	static timestamps = true
	static fields = {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		nNumber: {
			type: DataTypes.STRING,
			length: 50,
		},
		make: {
			type: DataTypes.STRING,
			length: 25,
		},
		model: {
			type: DataTypes.STRING,
			length: 25,
		},
	}
}

// For latitudes use: Decimal(8,6), and longitudes use: Decimal(9,6)
// https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases
export class Flight extends Model {
	static table = 'flights'
	static timestamps = true
	static fields = {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		startAirport: {
			type: DataTypes.STRING,
			length: 3,
		},
		startGpsLatitude: {
			type: DataTypes.decimal(8, 6),
		},
		startGpsLongitude: {
			type: DataTypes.decimal(9, 6),
		},
		endAirport: {
			type: DataTypes.STRING,
			length: 3,
			allowNull: true,
		},
		endGpsLatitude: {
			type: DataTypes.decimal(8, 6),
			allowNull: true,
		},
		endGpsLongitude: {
			type: DataTypes.decimal(9, 6),
			allowNull: true,
		},
		startTime: {
			type: DataTypes.INTEGER,
			length: 11,
		},
		endTime: {
			type: DataTypes.INTEGER,
			length: 11,
			allowNull: true,
		},
		durationMinutes: {
			type: DataTypes.INTEGER,
			length: 11,
			allowNull: true,
		},
	}
}

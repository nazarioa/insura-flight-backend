import { DataTypes, Model } from 'denodb/mod.ts'

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

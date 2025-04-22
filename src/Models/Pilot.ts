import { DataTypes, Model } from 'denodb';

export class Pilot extends Model {
  static override table = 'pilots';
  static override timestamps = true;
  static override fields = {
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
  };
}

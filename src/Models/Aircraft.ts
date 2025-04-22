import { DataTypes, Model } from 'denodb';

export class Aircraft extends Model {
  static override table = 'aircraft';
  static override timestamps = true;
  static override fields = {
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
  };
}

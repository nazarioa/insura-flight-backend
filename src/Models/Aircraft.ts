import { DataTypes, Model } from 'denodb/mod.ts';

export class Aircraft extends Model {
  static table = 'aircraft';
  static timestamps = true;
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
  };
}

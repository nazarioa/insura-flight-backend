import { DataTypes, Model } from 'denodb';

// For latitudes use: Decimal(8,6), and longitudes use: Decimal(9,6)
// https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases
export class Flight extends Model {
  static override table = 'flights';
  static override timestamps = true;
  static override fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    aircraftNNumber: {
      type: DataTypes.STRING,
    },
    pilotId: {
      type: DataTypes.UUID,
    },
    startGpsLatitude: {
      type: DataTypes.DECIMAL,
      precision: 8,
      scale: 6,
      allowNull: true,
    },
    startGpsLongitude: {
      type: DataTypes.DECIMAL,
      precision: 9,
      scale: 6,
      allowNull: true,
    },
    endGpsLatitude: {
      type: DataTypes.DECIMAL,
      precision: 8,
      scale: 6,
      allowNull: true,
    },
    endGpsLongitude: {
      type: DataTypes.DECIMAL,
      precision: 9,
      scale: 6,
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
  };
}

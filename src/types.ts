export interface FlightGps {
  gpsLatitude: number;
  gpsLongitude: number;
}

export interface FlightNode extends FlightGps {
  flightNode: 'start' | 'end';
  dateTimeEpoc: number;
}

export interface FlightEntry {
  aircraftNNumber: string;
  dateTimeEpoc: number;
  pilotId: string;
}

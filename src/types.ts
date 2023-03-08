export interface FlightEntry extends FlightNode {
  aircraftNNumber: string;
  pilotId: string;
}

export interface FlightNode {
  dateTimeEpoc: number;
  gpsLatitude: string;
  gpsLongitude: string;
  airport?: string;
}

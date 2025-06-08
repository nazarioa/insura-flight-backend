export interface FlightGpsRequest {
  gpsLatitude: number;
  gpsLongitude: number;
}

export interface FlightNodeRequest extends FlightGpsRequest {
  flightNode: 'start' | 'end';
  dateTimeEpoc: number;
}

export type FlightEntryRequest = {
  aircraftNNumber: string;
  dateTimeEpoc: string;
  pilotId: string;
};

export type FlightEntryDto = {
  aircraft_n_number: string;
  datetime_epoc: number;
  pilot_id: string;
};

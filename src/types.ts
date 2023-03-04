export interface FlightEntry {
	/*
  pilotDetails: Pilot
  flightStart: FlightNode
  flightEnd: FlightNode
  aircraftN: string
  */
	aircraftN: string
	pilotFirstName: string
	pilotLastName: string
	pilotIdNumber: string
	startDateTime: string
	startGpsLocation: string
	startAirport: string
	endDateTime: string
	endGpsLocation: string
	endAirport: string
}

export interface Pilot {
	firstName: string
	lastName: string
	idNumber: string
}

export interface FlightNode {
	dateTime: string
	gpsLocation: string
	airport: string
}

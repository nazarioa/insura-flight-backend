export interface FlightEntry {
	aircraftNNumber: string
	pilotId: string
	startNode: FlightNode
}

export interface FlightNode {
	dateTimeEpoc: number
	gpsLatitude: string
	gpsLongitude: string
	airport?: string
}

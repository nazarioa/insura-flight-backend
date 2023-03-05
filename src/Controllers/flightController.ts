import { RouterContext } from 'oak/mod.ts'
import { Flight } from '../Models/Flight.ts'
import { FlightNode } from '../types.ts'

export const getPilotsFlights = async (ctx: RouterContext) => {
	const pilotId = ctx.params.pilotId
	try {
		ctx.response.status = 200
		ctx.response.body = await Flight
			.where('pilotId', '=', pilotId.trim().toString())
			.limit(200)
	} catch (e) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'Could not get Pilots Flight log' }
	}
}

export const createFlight = async (ctx: RouterContext) => {
	const flightEntry = await ctx.request.body().value

	const id = await flightsCollection.insertOne(flightEntry)
	ctx.response.status = 201
	ctx.response.body = { id }
}

export const endFlight = async (ctx: RouterContext) => {
	const flightEndNode = await ctx.request.body().value as FlightNode
	const flightId = await ctx.params.flightId
	const startedFlight = await Flight
		.where('id', '=', flightId.trim().toString())
		.where('endTime', '=', null)
		.first()

	if (!startedFlight) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'Could not end flight' }
	}

	try {
		startedFlight.endTime = flightEndNode.dateTime
		startedFlight.endGpsLatitude = flightEndNode.gpsLatitude
		startedFlight.endGpsLongitude = flightEndNode.gpsLongitude
		startedFlight.update()
		ctx.response.status = 201
		ctx.response.body = { 'message': 'End of flight recorded successfully' }
	} catch (e) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'Could not end flight' }
	}
}

export const getFlight = async (ctx: RouterContext) => {
	const flightId = await ctx.request.body().value
	// get flight from DB
	ctx.response.status = 201
	ctx.response.body = { flightId }
}

export const updateFlight = async (ctx: RouterContext) => {
	const flightId = await ctx.request.body().value
	// update flight in DB
	ctx.response.status = 201
	ctx.response.body = { flightId }
}

export const deleteFlight = async (ctx: RouterContext) => {
	const flightId = await ctx.request.body().value
	// update flight in DB
	ctx.response.status = 201
	ctx.response.body = { flightId }
}

import { RouterContext } from 'oak/mod.ts'
import { Flight } from '../Models/Flight.ts'
import { FlightEntry, FlightNode } from '../types.ts'
import { ResponseCreator } from '../Models/Response.class.ts'

export const getPilotsFlights = async (ctx: RouterContext) => {
	const pilotId = ctx.params.pilotId
	try {
		ctx.response.status = 200
		ctx.response.body = await Flight
			.where('pilotId', '=', pilotId.trim().toString())
			.limit(200)
			.all()
		return
	} catch (e) {
		const response = new ResponseCreator(
			403,
			'Could not get Pilots Flight log',
		)
		ctx.response.body = response.payload
		ctx.response.status = response.status
		return
	}
}

export const startFlight = async (ctx: RouterContext) => {
	let flightEntry: FlightEntry = null

	try {
		flightEntry = await ctx.request.body().value as FlightEntry
	} catch (e) {
		const response = new ResponseCreator(402, 'Bad flight creation data')
		ctx.response.body = response.payload
		ctx.response.status = response.status
		return
	}

	const id = crypto.randomUUID()
	await Flight.create({
		id,
		aircraftNNumber: flightEntry.aircraftNNumber,
		pilotId: flightEntry.pilotId,
		startGpsLatitude: flightEntry.gpsLatitude,
		startGpsLongitude: flightEntry.gpsLongitude,
		startTime: flightEntry.dateTimeEpoc,
	})
	const response = new ResponseCreator(
		201,
		'Flight start recorded successfully',
		{ flightId: id },
	)
	ctx.response.status = response.status
	ctx.response.body = response.payload
	return
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
	const flightId = ctx.params.flightId
	const existingFlight = await Flight
		.where('id', '=', flightId.trim().toString())
		.first()

	if (!existingFlight) {
		const response = new ResponseCreator(200, 'Flight deleted')
		ctx.response.status = response.status
		ctx.response.body = response.payload
		return
	}

	try {
		await existingFlight.delete()
		const response = new ResponseCreator(200, 'Flight deleted')
		ctx.response.status = response.status
		ctx.response.body = response.payload
		return
	} catch (e) {
		const response = new ResponseCreator(403, 'Could not delete Flight')
		ctx.response.status = response.status
		ctx.response.body = response.payload
		return
	}
}

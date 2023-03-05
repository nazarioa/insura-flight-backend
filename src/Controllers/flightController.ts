import { RouterContext } from 'oak/mod.ts'
import { Flight } from '../Models/Flight.ts'

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

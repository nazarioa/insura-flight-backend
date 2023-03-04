import { RouterContext } from './deps.ts'

export const getAllFlights = async (ctx: RouterContext) => {
	// const flights = await flightsCollection.find()
	ctx.response.body = await flightsCollection.find()
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

import { RouterContext } from 'oak/mod.ts'
import { Aircraft } from '../models.ts'

export const getAllAircraft = async (ctx: RouterContext) => {
	ctx.response.body = await Aircraft.all()
}

export const createAircraft = async (ctx: RouterContext) => {
	const { nNumber, make, model } = await ctx.request.body().value

	const id = await Aircraft.create({ nNumber, make, model })
	ctx.response.status = 201
	ctx.response.body = { id, nNumber, make, model }
}

export const getAircraft = async (ctx: RouterContext) => {
	const nNumber = await ctx.request.body().value
	const aircraft = await Aircraft.find({ nNumber })
	if (aircraft) {
		ctx.response.status = 200
		ctx.response.body = { aircraft }
	} else {
		ctx.response.status = 404
	}
}

export const updateAircraft = async (ctx: RouterContext) => {
  const aircraftId = await ctx.request.body().value;
  // update aircraft in DB
  ctx.response.status = 201
  ctx.response.body = {aircraftId}
}

export const deleteAircraft = async (ctx: RouterContext) => {
	const nNumber = await ctx.request.body().value
	const aircraft = await Aircraft.deleteById(nNumber)
	ctx.response.status = 200
}

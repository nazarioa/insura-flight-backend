import { RouterContext } from 'oak/mod.ts'
import { Aircraft } from '../models.ts'

export const getAllAircraft = async (ctx: RouterContext) => {
	ctx.response.body = await Aircraft.all()
	ctx.response.status = 200
	return
}

export const createAircraft = async (ctx: RouterContext) => {
	const { nNumber, make, model } = await ctx.request.body().value

	const existingAircraft = await Aircraft
		.where('nNumber', '=', nNumber.trim().toString())
		.first()

	if (existingAircraft) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'could not create aircraft' }
		return
	}

	try {
		const id = crypto.randomUUID()
		await Aircraft.create({ id, nNumber, make, model })
		ctx.response.body = { 'message': 'Aircraft created' }
		ctx.response.status = 201
		return
	} catch (e) {
		ctx.response.body = { 'error': e.toString() }
		ctx.response.status = 500
		return
	}
}

export const getAircraft = async (ctx: RouterContext) => {
	const nNumber = ctx.params.nNumber
	const existingAircraft = await Aircraft
		.where('nNumber', '=', nNumber.trim().toString())
		.first()

	if (!existingAircraft) {
		ctx.response.status = 404
		ctx.response.body = { 'error': 'Aircraft not found' }
		return
	}

	ctx.response.body = existingAircraft
	ctx.response.status = 200
	return
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

import { RouterContext } from 'oak/mod.ts'
import { Pilot } from '../Models/Pilot.ts'

export const getAllPilots = async (ctx: RouterContext) => {
	ctx.response.body = await Pilot.all()
	ctx.response.status = 200
}

export const createPilot = async (ctx: RouterContext) => {
	const { firstName, lastName } = await ctx.request.body().value

	const existingPilot = await Pilot
		.where('firstName', '=', firstName.trim().toString())
		.where('lastName', '=', lastName.trim().toString())
		.first()

	if (existingPilot) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'could not create pilot' }
		return
	}

	try {
		const id = crypto.randomUUID()
		await Pilot.create({ id, firstName, lastName })
		ctx.response.body = { 'message': 'Pilot created' }
		ctx.response.status = 201
		return
	} catch (e) {
		ctx.response.body = { 'error': e.toString() }
		ctx.response.status = 500
	}
}

export const getPilot = async (ctx: RouterContext) => {
	const id = ctx.params.id
	const existingPilot = await Pilot
		.where('id', '=', id.trim().toString())
		.first()

	if (!existingPilot) {
		ctx.response.status = 404
		ctx.response.body = { 'error': 'Pilot not found' }
		return
	}

	ctx.response.body = existingPilot
	ctx.response.status = 200
	return
}

export const updatePilot = async (ctx: RouterContext) => {
	const id = ctx.params.id
	const existingPilot = await Pilot
		.where('id', '=', id.trim().toString())
		.first()

	if (!existingPilot) {
		ctx.response.status = 404
		ctx.response.body = { 'error': 'Pilot not found' }
		return
	}

	const { firstName, lastName } = await ctx.request.body().value
	existingPilot.firstName = firstName
	existingPilot.lastName = lastName

	try {
		await existingPilot.update()
		ctx.response.body = { 'message': 'Pilot updated' }
		ctx.response.status = 201
		return
	} catch (e) {
		ctx.response.body = { 'error': 'Could not update pilot' }
		ctx.response.status = 403
		return
	}
}

export const deletePilot = async (ctx: RouterContext) => {
	const id = ctx.params.id
	const existingPilot = await Pilot
		.where('id', '=', id.trim().toString())
		.first()

	if (!existingPilot) {
		ctx.response.status = 200
		ctx.response.body = { 'message': 'Pilot deleted' }
		return
	}

	try {
		await existingPilot.delete()
		ctx.response.status = 200
		ctx.response.body = { 'message': 'Pilot deleted' }
	} catch (e) {
		ctx.response.status = 403
		ctx.response.body = { 'error': 'Could not delete pilot' }
	}
}

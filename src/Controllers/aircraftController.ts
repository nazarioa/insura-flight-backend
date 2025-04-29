import { RouterContext } from 'jsr:@oak/oak/router';
import { Aircraft } from '../Models/Aircraft.ts';

export const getAllAircraft = async (ctx: RouterContext) => {
  ctx.response.body = await Aircraft.all();
  ctx.response.status = 200;
  return;
};

export const createAircraft = async (ctx: RouterContext) => {
  const { nNumber, make, model } = await ctx.request.body().value;

  const existingAircraft = await Aircraft
    .where('nNumber', '=', nNumber.trim().toString())
    .first();

  if (existingAircraft) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'could not create aircraft' };
    return;
  }

  try {
    const id = crypto.randomUUID();
    await Aircraft.create({ id, nNumber, make, model });
    ctx.response.body = { 'message': 'Aircraft created' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    ctx.response.body = { 'error': e.toString() };
    ctx.response.status = 500;
    return;
  }
};

export const getAircraft = async (ctx: RouterContext) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await Aircraft
    .where('nNumber', '=', nNumber.trim().toString())
    .first();

  if (!existingAircraft) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Aircraft not found' };
    return;
  }

  ctx.response.body = existingAircraft;
  ctx.response.status = 200;
  return;
};

export const updateAircraft = async (ctx: RouterContext) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await Aircraft
    .where('nNumber', '=', nNumber.trim().toString())
    .first();

  if (!existingAircraft) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Aircraft not found' };
    return;
  }

  const { make, model } = await ctx.request.body().value;
  existingAircraft.make = make;
  existingAircraft.model = model;

  try {
    await existingAircraft.update();
    ctx.response.body = { 'message': 'Aircraft updated' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    ctx.response.body = { 'error': 'Could not update Aircraft' };
    ctx.response.status = 403;
    return;
  }
};

export const deleteAircraft = async (ctx: RouterContext) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await Aircraft
    .where('nNumber', '=', nNumber.trim().toString())
    .first();

  if (!existingAircraft) {
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Aircraft deleted' };
    return;
  }

  try {
    await existingAircraft.delete();
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Aircraft deleted' };
  } catch (e) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'Could not delete Aircraft' };
  }
};

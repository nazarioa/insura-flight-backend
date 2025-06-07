import { RouterContext } from 'jsr:@oak/oak/router';
import { Pilot } from '../Models/Pilot.ts';
import { PrismaClient } from '../../prisma/client.ts';

const prisma = PrismaClient;

export const getAllPilotsHandler = async (ctx: RouterContext<'/pilots'>) => {
  ctx.response.body = await prisma.pilot.findMany();
  ctx.response.status = 200;
};

export const createPilotHandler = async (
  ctx: RouterContext<'/pilot', { firstName: string; lastName: string }>,
) => {
  const requestBody = await ctx.request.body.json();
  const { firstName, lastName } = requestBody ??
    { lastName: '', firstName: '' };

  const existingPilot = await prisma.pilot.findFirst({
    where: {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    },
  });

  if (existingPilot) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'could not create pilot' };
    return;
  }

  const id = crypto.randomUUID();
  try {
    await prisma.pilot.create({
      data: {
        id,
        first_name: firstName,
        last_name: lastName,
      },
    });

    ctx.response.body = { 'message': 'Pilot created' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    ctx.response.body = { 'error': e.toString() };
    ctx.response.status = 500;
  }
};

export const getPilotHandler = async (
  ctx: RouterContext<'/pilot/:id', { id: string }>,
) => {
  const id = ctx.params.id;
  const existingPilot = await prisma.pilot.findFirst({
    where: {
      'id': id.trim(),
    },
  });

  if (!existingPilot) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Pilot not found' };
    return;
  }

  ctx.response.body = existingPilot;
  ctx.response.status = 200;
  return;
};

export const updatePilotHandler = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const existingPilot = await Pilot
    .where('id', '=', id.trim().toString())
    .first();

  if (!existingPilot) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Pilot not found' };
    return;
  }

  const { firstName, lastName } = await ctx.request.body().value;
  existingPilot.firstName = firstName;
  existingPilot.lastName = lastName;

  try {
    await existingPilot.update();
    ctx.response.body = { 'message': 'Pilot updated' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    ctx.response.body = { 'error': 'Could not update pilot' };
    ctx.response.status = 403;
    return;
  }
};

export const deletePilotHandler = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const existingPilot = await Pilot
    .where('id', '=', id.trim().toString())
    .first();

  if (!existingPilot) {
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Pilot deleted' };
    return;
  }

  try {
    await existingPilot.delete();
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Pilot deleted' };
  } catch (e) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'Could not delete pilot' };
  }
};

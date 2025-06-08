import { RouterContext } from 'jsr:@oak/oak/router';
import { PrismaClient } from '../../prisma/client.ts';

const prisma = PrismaClient;

export const getAllAircraftHandler = async (
  ctx: RouterContext<'/aircraft'>,
) => {
  ctx.response.body = await prisma.aircraft.findMany();
  ctx.response.status = 200;
  return;
};

export const createAircraftHandler = async (
  ctx: RouterContext<
    '/aircraft',
    { nNumber: string; make: string; model: string }
  >,
) => {
  const requestBody = await ctx.request.body.json();
  const { nNumber, make, model } = requestBody ??
    { nNumber: '', make: '', model: '' };

  const existingAircraft = await prisma.aircraft.findFirst({
    where: {
      n_number: nNumber.trim().toString(),
    },
  });

  if (existingAircraft) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'could not create aircraft' };
    return;
  }

  try {
    const id = crypto.randomUUID();
    await prisma.aircraft.create({
      data: { id, n_number: nNumber, make, model },
    });
    ctx.response.body = { 'message': 'Aircraft created' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    if (e instanceof Error) {
      ctx.response.body = {
        'error': `Aircraft could not be created ${e.toString()}`,
      };
    } else {
      ctx.response.body = { 'error': 'Aircraft could not be created' };
    }
    ctx.response.status = 500;
    return;
  }
};

export const getAircraftHandler = async (
  ctx: RouterContext<'/aircraft/:nNumber', { nNumber: string }>,
) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await prisma.aircraft.findFirst({
    where: {
      n_number: nNumber.trim().toString(),
    },
  });

  if (!existingAircraft) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Aircraft not found' };
    return;
  }

  ctx.response.body = existingAircraft;
  ctx.response.status = 200;
  return;
};

export const updateAircraftHandler = async (
  ctx: RouterContext<'/aircraft/:nNumber', { nNumber: string }>,
) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await prisma.aircraft.findFirst({
    where: { n_number: nNumber.trim() },
  });

  if (!existingAircraft) {
    ctx.response.status = 404;
    ctx.response.body = { 'error': 'Aircraft not found' };
    return;
  }

  const requestBody = await ctx.request.body.json();
  const { make, model } = requestBody ??
    { make: '', model: '' };

  try {
    await prisma.aircraft.update({
      where: {
        n_number: existingAircraft.n_number,
      },
      data: {
        make: make.trim(),
        model: model.trim(),
      },
    });
    ctx.response.body = { 'message': 'Aircraft updated' };
    ctx.response.status = 201;
    return;
  } catch (e) {
    ctx.response.body = { 'error': 'Could not update Aircraft' };
    ctx.response.status = 403;
    return;
  }
};

export const deleteAircraftHandler = async (
  ctx: RouterContext<'/aircraft/:nNumber', { nNumber: string }>,
) => {
  const nNumber = ctx.params.nNumber;
  const existingAircraft = await prisma.aircraft.findFirst({
    where: { n_number: nNumber.trim() },
  });

  if (!existingAircraft) {
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Aircraft deleted' };
    return;
  }

  try {
    await prisma.aircraft.delete({
      where: {
        n_number: existingAircraft.n_number,
      },
    });
    ctx.response.status = 200;
    ctx.response.body = { 'message': 'Aircraft deleted' };
  } catch (e) {
    ctx.response.status = 403;
    ctx.response.body = { 'error': 'Could not delete Aircraft' };
  }
};

import { RouterContext } from 'jsr:@oak/oak/router';
import { Flight } from '../Models/Flight.ts';
import { FlightEntry, FlightNode } from '../types.ts';
import { ResponseCreator } from '../Models/Response.class.ts';

export const getPilotsFlightsHandler = async (ctx: RouterContext) => {
  const pilotId = ctx.params.pilotId;
  try {
    ctx.response.status = 200;
    ctx.response.body = await Flight
      .where('pilotId', '=', pilotId.trim().toString())
      .limit(200)
      .all();
    return;
  } catch (e) {
    const response = new ResponseCreator(
      403,
      'Could not get Pilots Flight log',
    );
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }
};

export const startFlightHandler = async (ctx: RouterContext) => {
  let flightEntry: FlightEntry;

  try {
    flightEntry = await ctx.request.body().value as FlightEntry;
  } catch (e) {
    const response = new ResponseCreator(402, 'Bad flight creation data');
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  if (!flightEntry) {
    const response = new ResponseCreator(
      500,
      'Something went wrong' + JSON.stringify(flightEntry ?? {}),
    );
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  const id = crypto.randomUUID();
  await Flight.create({
    id,
    aircraftNNumber: flightEntry.aircraftNNumber,
    pilotId: flightEntry.pilotId,
    startTime: flightEntry.dateTimeEpoc,
  });
  const response = new ResponseCreator(
    201,
    'Flight start recorded successfully',
    { flightId: id },
  );
  ctx.response.status = response.status;
  ctx.response.body = response.payload;
  return;
};

export const gpsUpdateFlightHandler = async (ctx: RouterContext) => {
  const flightId = await ctx.params.flightId;
  const flight = await Flight
    .where('id', '=', flightId.trim().toString())
    .first();

  if (!flight) {
    const response = new ResponseCreator(
      404,
      'Could not find flight',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }

  const flightGpsUpdate = await ctx.request.body().value as FlightNode;
  if (flightGpsUpdate.flightNode === 'start') {
    flight.startGpsLongitude = flightGpsUpdate.gpsLongitude;
    flight.startGpsLatitude = flightGpsUpdate.gpsLatitude;
    await flight.update();
    const response = new ResponseCreator(
      200,
      'Updated start gps for flight',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  } else if (flightGpsUpdate.flightNode === 'end') {
    flight.endGpsLongitude = flightGpsUpdate.gpsLongitude;
    flight.endGpsLatitude = flightGpsUpdate.gpsLatitude;
    await flight.update();
    const response = new ResponseCreator(
      200,
      'Updated end gps for flight',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  } else {
    const response = new ResponseCreator(
      400,
      'Not sure what to update',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }
};

export const endFlightHandler = async (ctx: RouterContext) => {
  const flightEndNode = await ctx.request.body().value as FlightNode;
  const flightId = await ctx.params.flightId;
  const startedFlight = await Flight
    .where('id', '=', flightId.trim().toString())
    // Where null is not yet supported
    // .where('endTime', '=', null)
    .first();

  if (!startedFlight) {
    const response = new ResponseCreator(
      403,
      'Could not end flight',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }

  const flightDurationInMinutes = Math.floor(
    (flightEndNode.dateTimeEpoc - startedFlight.startTime) / 60000,
  );

  try {
    startedFlight.endTime = flightEndNode.dateTimeEpoc;
    startedFlight.durationMinutes = flightDurationInMinutes;
    startedFlight.update();
    const response = new ResponseCreator(
      201,
      'End of flight recorded successfully',
      { flightId, flightDurationInMinutes },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  } catch (e) {
    const response = new ResponseCreator(
      403,
      'Could not end flight',
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }
};

export const getFlightHandler = async (ctx: RouterContext) => {
  const flightId = await ctx.request.body().value;
  // get flight from DB
  ctx.response.status = 201;
  ctx.response.body = { flightId };
};

export const updateFlightHandler = async (ctx: RouterContext) => {
  const flightId = await ctx.request.body().value;
  // update flight in DB
  ctx.response.status = 201;
  ctx.response.body = { flightId };
};

export const deleteFlightHandler = async (ctx: RouterContext) => {
  const flightId = ctx.params.flightId;
  const existingFlight = await Flight
    .where('id', '=', flightId.trim().toString())
    .first();

  if (!existingFlight) {
    const response = new ResponseCreator(200, 'Flight deleted');
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }

  try {
    await existingFlight.delete();
    const response = new ResponseCreator(200, 'Flight deleted');
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  } catch (e) {
    const response = new ResponseCreator(403, 'Could not delete Flight');
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }
};

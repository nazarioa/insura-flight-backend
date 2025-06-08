import { RouterContext } from 'jsr:@oak/oak/router';
import {
  convFlightEntryRequestToFlightEntryDto,
  isFlightEntryRequest,
} from '../Models/Flight.ts';
import { FlightEntryRequest } from '../types.ts';
import { ResponseCreator } from '../Models/Response.class.ts';
import { PrismaClient } from '../../prisma/client.ts';

const prisma = PrismaClient;

export const getPilotsFlightsHandler = async (
  ctx: RouterContext<'/flights/:pilotId', { pilotId: string }>,
) => {
  const pilotId = ctx.params.pilotId;
  try {
    ctx.response.status = 200;
    ctx.response.body = await prisma.flight.findMany({
      take: 200,
      where: {
        pilot_id: pilotId.trim().toString(),
      },
    });
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

export const startFlightHandler = async (
  ctx: RouterContext<'/flight/start', FlightEntryRequest>,
) => {
  let entryRequest: FlightEntryRequest = {
    aircraftNNumber: '',
    dateTimeEpoc: '',
    pilotId: '',
  };

  try {
    entryRequest = await ctx.request.body.json() as FlightEntryRequest;
  } catch (e) {
    const response = new ResponseCreator(402, 'Bad flight creation data');
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  if (!entryRequest || !isFlightEntryRequest(entryRequest)) {
    const response = new ResponseCreator(
      500,
      'Something went wrong' + JSON.stringify(entryRequest ?? {}),
    );
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  const id = crypto.randomUUID();
  const flightStartNode = convFlightEntryRequestToFlightEntryDto(entryRequest);
  await prisma.flight.create({
    data: {
      id,
      aircraft_n_number: flightStartNode.aircraft_n_number,
      pilot_id: flightStartNode.pilot_id,
      start_time: flightStartNode.datetime_epoc,
    },
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

export const gpsUpdateFlightHandler = async (
  ctx: RouterContext<'/flight/gps-update/:flightId', { flightId: string }>,
) => {
  const flightId = ctx.params.flightId.trim().toString();
  const flight = await prisma.flight.findFirst({
    where: {
      id: flightId,
    },
  });

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

  const flightGpsUpdate = await ctx.request.body.json();
  // todo validate flightGpsUpdate is a valid flgiht node

  if (flightGpsUpdate.flightNode === 'start') {
    await prisma.flight.update({
      where: {
        id: flight.id,
      },
      data: {
        start_gps_longitude: flightGpsUpdate.gpsLongitude,
        start_gps_latitude: flightGpsUpdate.gpsLatitude,
      },
    });
    const response = new ResponseCreator(
      200,
      'Updated start gps for flight',
      { flightId },
    );
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  } else if (flightGpsUpdate.flightNode === 'end') {
    await prisma.flight.update({
      where: {
        id: flight.id,
      },
      data: {
        end_gps_longitude: flightGpsUpdate.gpsLongitude,
        end_gps_latitude: flightGpsUpdate.gpsLatitude,
      },
    });
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

export const endFlightHandler = async (
  ctx: RouterContext<'/flight/end/:flightId', { flightId: string }>,
) => {
  let entryRequest: FlightEntryRequest = {
    aircraftNNumber: '',
    dateTimeEpoc: '',
    pilotId: '',
  };

  try {
    entryRequest = await ctx.request.body.json() as FlightEntryRequest;
  } catch (e) {
    const response = new ResponseCreator(402, 'Bad flight end data');
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  if (!entryRequest || !isFlightEntryRequest(entryRequest)) {
    const response = new ResponseCreator(
      500,
      'Something went wrong' + JSON.stringify(entryRequest ?? {}),
    );
    ctx.response.body = response.payload;
    ctx.response.status = response.status;
    return;
  }

  const flightId = ctx.params?.flightId?.trim()?.toString() ?? '';
  const startedFlight = await prisma.flight.findFirst({
    where: {
      id: flightId,
      end_time: null,
    },
  });

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

  const flightEndNode = convFlightEntryRequestToFlightEntryDto(entryRequest);
  const flightDurationInMinutes = Math.floor(
    (flightEndNode.datetime_epoc - startedFlight.start_time) / 60000,
  );

  try {
    await prisma.flight.update({
      data: {
        duration_minutes: flightDurationInMinutes,
        end_time: flightEndNode.datetime_epoc,
      },
      where: {
        id: startedFlight.id,
      },
    });
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

export const getFlightHandler = async (ctx: RouterContext<'/flight/:id'>) => {
  const flightId = ctx.params?.id?.trim()?.toString() ?? '';
  // get flight from DB
  ctx.response.status = 201;
  ctx.response.body = { flightId };
};

export const updateFlightHandler = async (
  ctx: RouterContext<'/flight/:id'>,
) => {
  const flightId = ctx.params?.id?.trim()?.toString() ?? '';
  // update flight in DB
  ctx.response.status = 201;
  ctx.response.body = { flightId };
};

export const deleteFlightHandler = async (
  ctx: RouterContext<'/flight/:flightId'>,
) => {
  const flightId = ctx.params?.flightId?.trim()?.toString() ?? '';
  const existingFlight = await prisma.flight.findFirst({
    where: {
      id: flightId,
    },
  });

  if (!existingFlight) {
    const response = new ResponseCreator(200, 'Flight deleted');
    ctx.response.status = response.status;
    ctx.response.body = response.payload;
    return;
  }

  try {
    await prisma.flight.delete({
      where: {
        id: existingFlight.id,
      },
    });
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

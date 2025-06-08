import { FlightEntryDto, FlightEntryRequest } from '../types.ts';

export function isFlightEntryRequest(
  request: any,
): request is FlightEntryRequest {
  const validProps = !!request?.aircraftNNumber && !!request?.dateTimeEpoc &&
    !!request?.pilotId;
  return (
    validProps &&
    typeof request.aircraftNNumber === 'string' &&
    typeof request.dateTimeEpoc === 'string' &&
    typeof request.pilotId === 'string'
  );
}

export function convFlightEntryRequestToFlightEntryDto(
  request: FlightEntryRequest,
): FlightEntryDto {
  return {
    aircraft_n_number: request.aircraftNNumber.trim(),
    datetime_epoc: parseInt(request.dateTimeEpoc.trim(), 10),
    pilot_id: request.pilotId.trim(),
  };
}

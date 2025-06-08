import { Router, RouterContext } from 'jsr:@oak/oak/router';
import { Application } from 'jsr:@oak/oak/application';
import * as flightC from './Controllers/flightController.ts';
import * as pilotC from './Controllers/pilotController.ts';
import * as aircraftC from './Controllers/aircraftController.ts';
import { oakCors } from 'oakCors';

const app = new Application();
const router = new Router();
const port: number = 8000;

router.get('/', (ctx: RouterContext<string>) => {
  ctx.response.body = 'Hello from Deno';
})
  // flight
  .get('/flights/:pilotId', flightC.getPilotsFlightsHandler)
  .get('/flight/:id', flightC.getFlightHandler)
  .put('/flight/:id', flightC.updateFlightHandler)
  .post('/flight/end/:flightId', flightC.endFlightHandler)
  .put('/flight/gps-update/:flightId', flightC.gpsUpdateFlightHandler)
  .post('/flight/start', flightC.startFlightHandler)
  .delete('/flight/:flightId', flightC.deleteFlightHandler)
  // pilot
  .get('/pilots', pilotC.getAllPilotsHandler)
  .get('/pilot/:id', pilotC.getPilotHandler)
  .post('/pilot', pilotC.createPilotHandler)
  .put('/pilot/:id', pilotC.updatePilotHandler)
  .delete('/pilot/:id', pilotC.deletePilotHandler)
  // aircraft
  .get('/aircraft', aircraftC.getAllAircraftHandler)
  .get('/aircraft/:nNumber', aircraftC.getAircraftHandler)
  .post('/aircraft', aircraftC.createAircraftHandler)
  .put('/aircraft/:nNumber', aircraftC.updateAircraftHandler)
  .delete('/aircraft/:nNumber', aircraftC.deleteAircraftHandler);

app.use(oakCors());

// Here, we are telling our application to use the router
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port });
console.log(`Server is running on port ${port}`);

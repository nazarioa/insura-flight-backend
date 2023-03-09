import {
  deleteFlight,
  endFlight,
  getFlight,
  getPilotsFlights,
  startFlight,
  updateFlight,
} from './Controllers/flightController.ts';
import {
  createPilot,
  deletePilot,
  getAllPilots,
  getPilot,
  updatePilot,
} from './Controllers/pilotController.ts';
import {
  createAircraft,
  deleteAircraft,
  getAircraft,
  getAllAircraft,
  updateAircraft,
} from './Controllers/aircraftController.ts';
import { Application, Router, RouterContext } from 'oak';
import { doTheDatabase, getConnectionDetails } from './database-connection.ts';
import { oakCors } from 'oakCors';

const app = new Application();
const router = new Router();
const port: number = 8000;

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Hello from Deno';
})
  // flight
  .get('/flights/:pilotId', getPilotsFlights)
  .get('/flight/:id', getFlight)
  .put('/flight/:id', updateFlight)
  .post('/flight/start', startFlight)
  .post('/flight/end/:flightId', endFlight)
  .delete('/flight/:flightId', deleteFlight)
  // pilot
  .get('/pilots', getAllPilots)
  .get('/pilot/:id', getPilot)
  .post('/pilot', createPilot)
  .put('/pilot/:id', updatePilot)
  .delete('/pilot/:id', deletePilot)
  // aircraft
  .get('/aircraft', getAllAircraft)
  .get('/aircraft/:nNumber', getAircraft)
  .post('/aircraft', createAircraft)
  .put('/aircraft/:nNumber', updateAircraft)
  .delete('/aircraft/:nNumber', deleteAircraft);

app.use(oakCors());

// Here, we are telling our application to use the router
app.use(router.routes());
app.use(router.allowedMethods());

const { connectionType, connectionDetails } = getConnectionDetails();
await doTheDatabase(connectionType, connectionDetails);
app.listen({ port });
console.log(`Server is running on port ${port}`);

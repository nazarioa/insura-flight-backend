import { Application, Router, RouterContext } from './deps.ts'
import {
	createFlight,
	deleteFlight,
	getAllFlights,
	getFlight,
	updateFlight,
} from './Controllers/flightController.ts'

const app = new Application()
const router = new Router()
const port: number = 8000

router.get('/', (ctx: RouterContext) => {
	ctx.response.body = 'Hello from Deno'
})
	// flight
	.get('/flights', getAllFlights)
	.get('/flight/:id', getFlight)
	.post('/flight', createFlight)
	.put('/flight/:id', updateFlight)
	.delete('/flight/:id', deleteFlight)

// Here, we are telling our application to use the router
app.use(router.routes())
app.use(router.allowedMethods())
app.listen({ port })
console.log(`Server is running on port ${port}`)

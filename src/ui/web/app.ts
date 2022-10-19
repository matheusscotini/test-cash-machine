import * as http from 'http'
import express from 'express'
import * as routes from './routes'
import * as swagger from './swagger'
import { errorHandling } from './error-handling'

const port = Number(process.env.API_PORT) || 3000
const url = `${process.env.API_URL ?? 'http://localhost:3000'}/docs`

const app = express()

app.use(express.json())

routes.setup(app)
swagger.setup(app)
app.use(errorHandling)

const initServer = (): http.Server => app
  .listen(port, () => console.log(`Running on ${url}`))

export {
  initServer,
  app
}

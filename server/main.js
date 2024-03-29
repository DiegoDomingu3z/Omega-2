import express from 'express'
import { socketProvider } from './SocketProvider'
import { Startup } from './Startup'
import { DbConnection } from './db/DbConfig'
import { logger } from './utils/Logger'
import { createServer } from 'http'

// create server & socketServer
const app = express()
const port = process.env.PORT || 3000

const httpServer = createServer(app)
Startup.ConfigureGlobalMiddleware(app)
Startup.ConfigureRoutes(app)


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

// Establish Socket
socketProvider.initialize(httpServer)

// Connect to Atlas MongoDB
DbConnection.connect()

app.get('/', (req, res) => {
  res.json("BOBBY SALINAS IS HELLA GAY")
})


// Start Server
httpServer.listen(port, () => {
  logger.log(`[SERVING ON PORT: ${port}]`)
})

// App Entry Point
// - Initialize Express app
// - Apply global middlewares (CORS, Helmet, rate limiting, body parser)
// - Mount all module routers (e.g. /api/v1/auth, /api/v1/products ...)
// - Mount global error handler middleware (must be last)
// - Export app for server.js

import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import apiLimit from './middlewares/rateLimiter.js'
import authRoutes from "./modules/auth/auth.routes.js"
const app = express()


//Global Middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())


app.use("/api" , apiLimit)
app.use("/api/auth" , authRoutes)



// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Safqa System API' })
})


// Global Error Handler
app.use(errorHandler)

export default app
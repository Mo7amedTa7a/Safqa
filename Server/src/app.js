// App Entry Point
// - Initialize Express app
// - Apply global middlewares (CORS, Helmet, rate limiting, body parser)
// - Mount all module routers (e.g. /api/auth, /api/products ...)
// - Mount global error handler middleware (must be last)
// - Export app for server.js

import cors from 'cors'
import express from 'express'

//Middlewares
import helmet from 'helmet'
import errorHandler from './middlewares/errorHandler.js'
import apiLimit from './middlewares/rateLimiter.js'

// APIs
import userRoutes from "./modules/users/user.routes.js"
import authRoutes from "./modules/auth/auth.routes.js"
import supplierProfileRoutes from "./modules/supplierProfiles/supplierProfile.routes.js"

const app = express()

//Global Middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())

// APIs
app.use("/api", apiLimit)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/supplier-profiles", supplierProfileRoutes)



// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Safqa System API' })
})


// Global Error Handler
app.use(errorHandler)

export default app
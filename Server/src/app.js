// App Entry Point
// - Initialize Express app
// - Apply global middlewares (CORS, Helmet, rate limiting, body parser)
// - Mount all module routers (e.g. /api/auth, /api/products ...)
// - Mount global error handler middleware (must be last)
// - Export app for server.js

import cors from 'cors';
import express from 'express';

//Middlewares
import helmet from 'helmet'
import errorHandler from './middlewares/errorHandler.js'
import apiLimit from './middlewares/rateLimiter.js'

// APIs
import authRoutes from "./modules/auth/auth.routes.js"
import supplierProfileRoutes from "./modules/supplierProfiles/supplierProfile.routes.js"
import userRoutes from "./modules/users/user.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import buyingRequestRoutes from "./modules/buyingRequests/buyingRequest.routes.js";
import buyingPoolRoutes from "./modules/buyingPools/buyingPool.routes.js";
import poolMemberRoutes from "./modules/poolMembers/poolMember.routes.js";
import supplierOfferRoutes from "./modules/supplierOffers/supplierOffer.routes.js";
import dealRoutes from "./modules/deals/deal.routes.js";
import dealSelectionRoutes from "./modules/deals/dealSelection.routes.js";
import directDealSelectionRoutes from "./modules/deals/directDealSelection.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";

import shipmentRoutes from "./modules/shipments/shipment.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import settlementRoutes from "./modules/settlements/settlement.routes.js";
import disputeRoutes from "./modules/disputes/dispute.routes.js";
import returnRoutes from "./modules/returns/return.routes.js";
import refundRoutes from "./modules/refunds/refund.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

const app = express()

//Global Middlewares
app.use(cors())
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// APIs
app.use("/api", apiLimit)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/supplier-profiles", supplierProfileRoutes)
app.use("/api/products", productRoutes)
app.use("/api/buying-requests", buyingRequestRoutes)
app.use("/api/buying-pools", buyingPoolRoutes)
app.use("/api/pool-members", poolMemberRoutes)
app.use("/api/supplier-offers", supplierOfferRoutes)
app.use("/api/deals", dealRoutes)
app.use("/api/deal-selections", dealSelectionRoutes)
app.use("/api/direct-deal-selections", directDealSelectionRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/shipments", shipmentRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/settlements", settlementRoutes)
app.use("/api/disputes", disputeRoutes)
app.use("/api/returns", returnRoutes)
app.use("/api/refunds", refundRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/notifications", notificationRoutes)

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Safqa System API' })
})


// Global Error Handler
app.use(errorHandler)

export default app

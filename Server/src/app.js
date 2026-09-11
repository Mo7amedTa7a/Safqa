// App Entry Point
// - Initialize Express app
// - Apply global middlewares (CORS, Helmet, rate limiting, body parser)
// - Mount all module routers (e.g. /api/v1/auth, /api/v1/products ...)
// - Mount global error handler middleware (must be last)
// - Export app for server.js
import productRoutes from "./modules/products/product.routes.js";
import buyingRequestRoutes from "./modules/buyingRequests/buyingRequest.routes.js";


app.use("/api/products", productRoutes);
app.use("/api/buying-requests", buyingRequestRoutes);
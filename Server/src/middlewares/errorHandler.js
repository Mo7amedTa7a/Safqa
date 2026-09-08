// Global Error Handler Middleware
// - Handle CastError (invalid MongoDB ObjectId)
// - Handle Duplicate key error (code 11000)
// - Handle Mongoose ValidationError
// - Handle JWT errors (JsonWebTokenError, TokenExpiredError)
// - In development: send full error stack
// - In production: send only operational errors to client

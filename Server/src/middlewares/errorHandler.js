// Global Error Handler Middleware
// - Handle CastError (invalid MongoDB ObjectId)
// - Handle Duplicate key error (code 11000)
// - Handle Mongoose ValidationError
// - Handle JWT errors (JsonWebTokenError, TokenExpiredError)
// - In development: send full error stack
// - In production: send only operational errors to client


const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose CastError
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID"
    }
    // Mongoose Duplicate
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value"
    }
    //Mongoose Validation 
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((err) => err.message)
            .join(",")
    }
    // JWT Invalid Token
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token"
    }
    //JWT Expired Token
    if (err.name === "TokenExpiredError") {
        statusCode = 401
        message = "Token expired"
    }

    const response = {
        status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
        message
    }

    //Development 
    if (process.env.NODE_ENV == "development") {
        response.error = err
        response.stack = err.stack
    }

    res.status(statusCode).json(response)
}

export default errorHandler
// Global Error Handler Middleware
// - Handle CastError (invalid MongoDB ObjectId)
// - Handle Duplicate key error (code 11000)
// - Handle Mongoose ValidationError
// - Handle JWT errors (JsonWebTokenError, TokenExpiredError)
// - In development: send full error stack
// - In production: send only operational errors to client

import { sendError } from "../utils/apiResponse.js";


const errorHandler = (err, req, res, next) => {
    let isOperational = err.isOperational || false;
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose CastError
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
        isOperational = true
    }
    // Mongoose Duplicate
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value"
        isOperational = true
    }
    //Mongoose Validation 
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((err) => err.message).join(",")
        isOperational = true
    }
    // JWT Invalid Token
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token"
        isOperational = true
    }
    //JWT Expired Token
    if (err.name === "TokenExpiredError") {
        statusCode = 401
        message = "Token expired"
        isOperational = true
    }

    // Development
    if (process.env.NODE_ENV === "development") {
        return res.status(statusCode).json({
            status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
            message,
            error: err,
            stack: err.stack
        });
    }
    // Production
    if (isOperational) {
        return sendError(res, statusCode, message)
    }
    return sendError(res, 500, "Something went wrong")
}

export default errorHandler
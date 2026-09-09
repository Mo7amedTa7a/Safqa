// Custom AppError Class
// - Extends native Error
// - Constructor accepts: message, statusCode
// - Sets this.status = 'fail' (4xx) or 'error' (5xx)
// - Sets this.isOperational = true (to distinguish from unexpected bugs)
// - Used across all layers to throw handled errors

class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError
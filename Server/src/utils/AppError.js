// Custom AppError Class
// - Extends native Error
// - Constructor accepts: message, statusCode
// - Sets this.status = 'fail' (4xx) or 'error' (5xx)
// - Sets this.isOperational = true (to distinguish from unexpected bugs)
// - Used across all layers to throw handled errors

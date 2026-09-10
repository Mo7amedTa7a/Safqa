// API Response Helpers
// - sendSuccess(res, statusCode, message, data): standard success response
// - sendError(res, statusCode, message): standard error response
// Response shape: { status, message, data? }
// Ensures consistent response format across all controllers


const sendSuccess = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        ...(data != undefined && { data })
    })
}

const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
        message
    })

}
export {
    sendSuccess,
    sendError
}
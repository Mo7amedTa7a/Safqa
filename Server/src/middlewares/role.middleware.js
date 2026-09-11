// Role Authorization Middleware
// - Factory function: restrictTo(...roles)
// - Check if req.user.role is included in the allowed roles
// - Allowed roles: BUYER, SUPPLIER, ADMIN, SHIPPING_PARTNER
// - Return 403 Forbidden if role is not permitted
// - Must be used AFTER auth.middleware

import AppError from "../utils/AppError.js"


const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            return next(new AppError("You are not authorized to perform this action", 403))
        }
        next()
    }
}
export default authorize
// Role Authorization Middleware
// - Factory function: restrictTo(...roles)
// - Check if req.user.role is included in the allowed roles
// - Allowed roles: BUYER, SUPPLIER, ADMIN, SHIPPING_PARTNER
// - Return 403 Forbidden if role is not permitted
// - Must be used AFTER auth.middleware

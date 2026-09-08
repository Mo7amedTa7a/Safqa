// Authentication Middleware
// - Extract JWT token from Authorization header (Bearer token)
// - Verify token using JWT_SECRET
// - Find user by decoded token id
// - Attach user to req.user
// - Return 401 if token is missing, invalid, or expired

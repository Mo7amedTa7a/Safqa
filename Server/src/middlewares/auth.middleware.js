// Authentication Middleware
// - Extract JWT token from Authorization header (Bearer token)
// - Verify token using JWT_SECRET
// - Find user by decoded token id
// - Attach user to req.user
// - Return 401 if token is missing, invalid, or expired

import AppError from "../utils/AppError.js"
import jwt from 'jsonwebtoken'
const protect = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization

        if (!authHeader) {
            return next(new AppError("Authentication required", 401))
        }

        //check Bearer format
        const parts = authHeader.split(" ")
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return next(new AppError("Invalid authorization format", 401))
        }
        const token = parts[1]

        //verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        //store authenticated user data
        req.user = decoded
        next()
    } catch (err) {
        next(err)
    }
}

export default protect
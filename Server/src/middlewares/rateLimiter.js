import { rateLimit } from 'express-rate-limit'
import AppError from '../utils/AppError.js'


const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000, // Increased limit from 100 to 1000 requests per 15 mins for dev/testing
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new AppError("Too many requests, please try again later.", 429))
    }
})

export default apiLimit
// Auth Routes
// - Belongs to: Member 1
// - POST /register  → auth.controller.register
// - POST /login     → auth.controller.login
// - POST /logout    → auth.controller.logout
// - Apply auth.validation middleware before controller
import express from 'express'
import validate from '../../middlewares/validation.middleware.js'
import { registerSchema } from './auth.validation.js'
import { register } from './auth.controller.js'
const router = express.Router()

router.post("/register", validate(registerSchema), register)

export default router
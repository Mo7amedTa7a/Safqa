// Auth Routes
// - Belongs to: Member 1
// - POST /register  → auth.controller.register
// - POST /login     → auth.controller.login
// - POST /logout    → auth.controller.logout
// - Apply auth.validation middleware before controller
import express from 'express'
import validate from '../../middlewares/validation.middleware.js'
import { loginSchema, registerSchema } from './auth.validation.js'
import { login, register } from './auth.controller.js'
const router = express.Router()

router.post("/register", validate(registerSchema), register)

router.post("/login" , validate(loginSchema), login)

export default router
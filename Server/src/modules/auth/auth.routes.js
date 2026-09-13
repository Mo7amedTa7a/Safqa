// Auth Routes
// - Belongs to: Member 1
// - POST /register  ? auth.controller.register
// - POST /login     ? auth.controller.login
// - POST /logout    ? auth.controller.logout
// - Apply auth.validation middleware before controller
import express from 'express'
import validate from '../../middlewares/validate.middleware.js'
import upload from '../../middlewares/upload.middleware.js'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js'
import { login, logout, register, forgotPassword, resetPassword } from './auth.controller.js'
const router = express.Router()

router.post(
    "/register",
    upload.single('profileImage'),
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post(
    "/logout",
    logout
);

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
);

router.post(
    "/reset-password/:token",
    validate(resetPasswordSchema),
    resetPassword
);

export default router

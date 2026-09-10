// Auth Controller
// - Belongs to: Member 1
// - register: POST /api/v1/auth/register
// - login:    POST /api/v1/auth/login
// - logout:   POST /api/v1/auth/logout
// - Uses asyncHandler to forward errors to global error handler

import { sendSuccess } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    //remove password
    user.password = undefined

    return sendSuccess(res, 201, "User Registered Successfully", user)
})

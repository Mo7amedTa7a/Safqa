// User Controller
// - Belongs to: Member 1
// - GET    /me           → getMe (authenticated)
// - PATCH  /me           → updateMe (authenticated)
// - GET    /             → getAllUsers (ADMIN)
// - GET    /:id          → getUserById (ADMIN)
// - DELETE /:id          → deactivateUser (ADMIN)

import { sendSuccess } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import userService from "./user.service.js";


export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers()

    return sendSuccess(res, 200, "Users fetched successfully", users)
})

export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id)

    return sendSuccess(res, 200, " User fetched successfully", user)
})


export const getMe = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const user = await userService.getMe(id)
    return sendSuccess(res, 200, " User fetched successfully", user)
})

export const updateMe = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const user = await userService.updateMe(id, req.body)
    return sendSuccess(res, 200, "Profile updated successfully", user)
})

export const deactivateUser = asyncHandler(async (req, res) => {
    const user = await userService.deactivateUser(req.params.id)

    return sendSuccess(res, 200, "User deactivated successfully", user)

})
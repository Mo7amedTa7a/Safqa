// User Controller
// - Belongs to: Member 1
// - GET    /me           → getMe (authenticated)
// - PATCH  /me           → updateMe (authenticated)
// - GET    /             → getAllUsers (ADMIN)
// - POST   /             → createUser (ADMIN)
// - GET    /:id          → getUserById (ADMIN)
// - PATCH  /:id          → updateUser (ADMIN)
// - DELETE /:id          → deactivateUser (ADMIN)

import { sendSuccess } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import userService from "./user.service.js";
import { getFileUrl } from "../../middlewares/upload.middleware.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    return sendSuccess(res, 200, "Users fetched successfully", users);
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched successfully", user);
});

export const getMe = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const user = await userService.getMe(id);
    return sendSuccess(res, 200, "User fetched successfully", user);
});

export const updateMe = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const updateData = { ...req.body };

    if (req.file) {
        updateData.profileImage = getFileUrl(req, req.file);
    } else if (req.body.profileImage === '' || req.body.removeProfileImage === 'true' || req.body.profileImage === 'null') {
        updateData.profileImage = '';
    }

    delete updateData.removeProfileImage;

    const user = await userService.updateMe(id, updateData);
    return sendSuccess(res, 200, "Profile updated successfully", user);
});

export const deactivateUser = asyncHandler(async (req, res) => {
    const user = await userService.deactivateUser(req.params.id);
    return sendSuccess(res, 200, "User status toggled successfully", user);
});

export const createUserByAdminController = asyncHandler(async (req, res) => {
    const user = await userService.createUserByAdmin(req.body);
    return sendSuccess(res, 201, "User created successfully", user);
});

export const updateUserByAdminController = asyncHandler(async (req, res) => {
    const user = await userService.updateUserByAdmin(req.params.id, req.body);
    return sendSuccess(res, 200, "User updated successfully", user);
});
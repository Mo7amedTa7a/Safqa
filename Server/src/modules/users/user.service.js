// User Service
// - Belongs to: Member 1
// - getMe(userId): return current authenticated user profile
// - updateMe(userId, data): update name, phone, address
// - getAllUsers(): admin only - list all users
// - getUserById(id): admin only - get user by id
// - deactivateUser(id): admin only - set isActive = false
// - createUserByAdmin(data): admin only - create new user/partner/admin
// - updateUserByAdmin(id, data): admin only - update user role or status

import AppError from "../../utils/AppError.js"
import User from "./user.model.js"

const getAllUsers = async () => {
    return await User.find().select('-password');
}

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new AppError("User Not Found", 404);
    }
    return user;
}

const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new AppError("User Not Found", 404);
    }
    return user;
}

const updateMe = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: "after", runValidators: true }).select('-password');
    if (!user) {
        throw new AppError("User Not Found", 404);
    }
    return user;
}

const deactivateUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User Not Found", 404);
    }
    user.isActive = !user.isActive;
    await user.save();
    return user;
}

const createUserByAdmin = async (userData) => {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
        throw new AppError("Email already registered", 400);
    }
    const user = new User(userData);
    await user.save();
    const created = user.toObject();
    delete created.password;
    return created;
}

const updateUserByAdmin = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: "after", runValidators: true }).select('-password');
    if (!user) {
        throw new AppError("User Not Found", 404);
    }
    return user;
}

export default {
    getAllUsers,
    getUserById,
    getMe,
    updateMe,
    deactivateUser,
    createUserByAdmin,
    updateUserByAdmin
}
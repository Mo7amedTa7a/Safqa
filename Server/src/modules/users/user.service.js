// User Service
// - Belongs to: Member 1
// - getMe(userId): return current authenticated user profile
// - updateMe(userId, data): update name, phone, address
// - getAllUsers(): admin only - list all users
// - getUserById(id): admin only - get user by id
// - deactivateUser(id): admin only - set isActive = false

import AppError from "../../utils/AppError.js"
import User from "./user.model.js"



const getAllUsers = async () => {
    return await User.find()
}

const getUserById = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError("User Not Found", 404)
    }

    return user
}

const getMe = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError("User Not Found", 404)
    }

    return user
}

const updateMe = async (userId, updateDate) => {
    const user = await User.findByIdAndUpdate(userId, updateDate, { returnDocument: "after", runValidators: true })
    if (!user) {
        throw new AppError("User Not Found", 404)
    }
    return user;
}

const deactivateUser = (userId) => {
    const user = User.findByIdAndUpdate(userId,
        {
            isActive: false
        },
        {
            returnDocument: "after"
        }
    )
    if (!user) {
        throw new AppError("User Not Found", 404)
    }
    return user
}
export default {
    getAllUsers,
    getUserById,
    getMe,
    updateMe,
    deactivateUser
}
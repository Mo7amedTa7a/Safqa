// Auth Service
// - Belongs to: Member 1
// - register(userData): create new user, hash password, return user + token
// - login(email, password): find user, compare password, generate JWT
// - logout(): client-side token removal (stateless JWT)
// - generateToken(userId): sign and return JWT using JWT_SECRET

import bcrypt from 'bcryptjs'
import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"

const register = async (userData) => {
    const {
        name,
        email,
        password,
        role = "BUYER",
        phone,
        address,
        profileImage
    } = userData

    //Check if email already exists ?

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw  new AppError("Email already exists", 409)
    }

    //hash pass
    // const hashedPassword = await bcrypt.hash(password, 12)

    //create user 
    const user = await User.create({
        name,
        email,
        password,
        role,
        phone,
        address,
        profileImage
    })
    return user
}

export default {
    register
}
// Auth Service
// - Belongs to: Member 1
// - register(userData): create new user, hash password, return user + token
// - login(email, password): find user, compare password, generate JWT
// - logout(): client-side token removal (stateless JWT)
// - generateToken(userId): sign and return JWT using JWT_SECRET

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"
import sendEmail from "../../utils/email.js"

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
        throw new AppError("Email already exists", 409)
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

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );

    return { user, token }
}

const login = async (email, password) => {
    const user = await User.findOne({ email }).select("+password")

    //check user
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new AppError("User account is inactive", 403);
    }
    const isPasswordCorrect = await user.comparePassword(password)
    //password is matching ?
    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401)
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
    return { user, token }

}

const logout = async () => {
    return {
        message: "Logout successful"
    };
};

const forgotPassword = async (email) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("There is no user with this email address.", 404);
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendURL}/reset-password/${resetToken}`;

    const message = `Forgot your password? Click the link to reset your password: \n${resetLink}\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw new AppError("There was an error sending the email. Try again later!", 500);
    }

    return { message: "Token sent to email!" };
};

const resetPassword = async (token, newPassword) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        throw new AppError("Token is invalid or has expired", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return { message: "Password updated successfully. Please login with your new password." };
};

export default {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
}
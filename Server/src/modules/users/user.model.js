// User Model
// - Belongs to: Member 1
// - Fields: name, email, password, role, phone, address, isActive, rating, createdAt
// - Roles enum: BUYER | SUPPLIER | ADMIN | SHIPPING_PARTNER
// - Index on email (unique)


import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: [
                "BUYER", "SUPPLIER", "ADMIN", "SHIPPING_PARTNER"
            ],
            default: "BUYER"
        },
        profileImage: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }

    }, {
    timestamps: true
}
)

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", UserSchema);

export default User;
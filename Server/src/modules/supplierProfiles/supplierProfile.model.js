
import mongoose from "mongoose";

const SupplierProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        companyName: {
            type: String,
            required: true,
            trim: true
        },
        companyDescription: {
            type: String,
            required: true,
            trim: true
        },
        commercialRegistrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        taxIdentificationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        businessAddress: {
            type: String,
            required: true,
            trim: true
        },

        businessPhone: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            trim: true
        },

        yearsInBusiness: {
            type: Number,
            min: 0
        },

        verificationStatus: {
            type: String,
            enum: [
                'PENDING',
                'APPROVED',
                'REJECTED'
            ],
            default: 'PENDING'
        },

        supplierStatus: {
            type: String,
            enum: [
                'ACTIVE',
                'SUSPENDED',
                'BLOCKED'
            ],
            default: null
        },

        rejectionReason: {
            type: String,
            trim: true
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        reviewedAt: {
            type: Date
        }
    }, {
    timestamps: true
}

)

const SupplierProfile = mongoose.model('SupplierProfile', SupplierProfileSchema)

export default SupplierProfile
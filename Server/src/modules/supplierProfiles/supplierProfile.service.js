import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"
import SupplierProfile from "./supplierProfile.model.js";


const createSupplierProfile = async (userId, profileData) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.role !== "SUPPLIER") {
        throw new AppError("Only suppliers can create a supplier profile", 403)
    }
    const existingProfile = await SupplierProfile.create({
        user: userId,
        ...profileData
    })
    return existingProfile
}

const approveSupplierProfile = async (profileId, adminId) => {
    const supplierProfile = await SupplierProfile.findById(profileId)

    if (!supplierProfile) {
        throw new AppError("Supplier profile not found", 404);
    }
    if (supplierProfile.verificationStatus !== "PENDING") {
        throw new AppError(
            "Supplier profile has already been reviewed",
            400
        );
    }
    supplierProfile.verificationStatus = "APPROVED";
    supplierProfile.supplierStatus = "ACTIVE"
    supplierProfile.reviewedBy = adminId;
    supplierProfile.reviewedAt = new Date()

    await supplierProfile.save()

    return supplierProfile
}

const rejectSupplierProfile = async (profileId, adminId, rejectionReason) => {
    const supplierProfile = await SupplierProfile.findById(profileId)
    if (!supplierProfile) {
        throw new AppError("Supplier profile not found", 404);
    }
    if (supplierProfile.verificationStatus !== "PENDING") {
        throw new AppError(
            "Supplier profile has already been reviewed",
            400
        );
    }
    supplierProfile.verificationStatus = "REJECTED";
    supplierProfile.supplierStatus = null;
    supplierProfile.rejectionReason = rejectionReason;
    supplierProfile.reviewedBy = adminId;
    supplierProfile.reviewedAt = new Date()

    await supplierProfile.save()

    return supplierProfile

}

export default {
    createSupplierProfile,
    approveSupplierProfile,
    rejectSupplierProfile
}
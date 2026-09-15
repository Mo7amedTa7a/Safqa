import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js";
import SupplierProfile from "./supplierProfile.model.js";

const createSupplierProfile = async (userId, profileData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.role !== "SUPPLIER") {
        throw new AppError("Only suppliers can create a supplier profile", 403);
    }

    // Check if supplier already has a profile (e.g. updating or resubmitting after rejection)
    let profile = await SupplierProfile.findOne({ user: userId });
    if (profile) {
        Object.assign(profile, profileData, {
            verificationStatus: "PENDING",
            supplierStatus: null,
            rejectionReason: undefined,
            reviewedBy: undefined,
            reviewedAt: undefined
        });
        await profile.save();
        return profile;
    }

    const newProfile = await SupplierProfile.create({
        user: userId,
        ...profileData,
        verificationStatus: "PENDING"
    });
    return newProfile;
};

const getMySupplierProfile = async (userId) => {
    const profile = await SupplierProfile.findOne({ user: userId })
        .populate("user", "name email phone profileImage role");
    return profile;
};

const getAllSupplierProfiles = async (filter = {}) => {
    const profiles = await SupplierProfile.find(filter)
        .populate("user", "name email phone profileImage")
        .sort({ createdAt: -1 });
    return profiles;
};

const approveSupplierProfile = async (profileId, adminId) => {
    const supplierProfile = await SupplierProfile.findById(profileId);

    if (!supplierProfile) {
        throw new AppError("Supplier profile not found", 404);
    }

    supplierProfile.verificationStatus = "APPROVED";
    supplierProfile.supplierStatus = "ACTIVE";
    supplierProfile.rejectionReason = undefined;
    supplierProfile.reviewedBy = adminId;
    supplierProfile.reviewedAt = new Date();

    await supplierProfile.save();

    return supplierProfile;
};

const rejectSupplierProfile = async (profileId, adminId, rejectionReason) => {
    const supplierProfile = await SupplierProfile.findById(profileId);
    if (!supplierProfile) {
        throw new AppError("Supplier profile not found", 404);
    }

    supplierProfile.verificationStatus = "REJECTED";
    supplierProfile.supplierStatus = null;
    supplierProfile.rejectionReason = rejectionReason;
    supplierProfile.reviewedBy = adminId;
    supplierProfile.reviewedAt = new Date();

    await supplierProfile.save();

    return supplierProfile;
};

export default {
    createSupplierProfile,
    getMySupplierProfile,
    getAllSupplierProfiles,
    approveSupplierProfile,
    rejectSupplierProfile
};
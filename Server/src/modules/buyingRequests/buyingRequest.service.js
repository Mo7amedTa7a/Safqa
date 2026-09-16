// BuyingRequest Service
// - Belongs to: Member 2
// - createRequest: validate product + variant and create buyer demand
// - getMyRequests: buyer's own requests
// - getRequestById: buyer's own request
// - updateRequest: edit quantity/location while OPEN
// - cancelRequest: cancel only OPEN request

import mongoose from "mongoose";

import BuyingRequest from "./buyingRequest.model.js";
import Product from "../products/product.model.js";
import SupplierOffer from "../supplierOffers/supplierOffer.model.js";
import { createBuyingPool } from "../buyingPools/buyingPool.service.js";

import AppError from "../../utils/AppError.js";


const checkValidId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            `Invalid ${fieldName} ID`,
            400
        );
    }
};


const getProductAndVariant = async (productId, variantId) => {

    checkValidId(productId, "product");
    checkValidId(variantId, "variant");

    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError(
            "Product not found",
            404
        );
    }

    if (product.status !== "ACTIVE") {
        throw new AppError(
            "Product is not active",
            400
        );
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
        throw new AppError(
            "Variant not found in this product",
            404
        );
    }

    return {
        product,
        variant
    };
};


const createBuyingRequest = async (data, buyerId) => {
    checkValidId(buyerId, "buyer");

    const productName = data.productName;
    const category = data.category;
    const description = data.specifications;

    let productObj = await Product.findOne({ name: productName, category: category });
    if (!productObj) {
        productObj = await Product.create({
            name: productName,
            description: description,
            category: category,
            variants: [{
                sku: `CUSTOM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                attributes: new Map([["المواصفات", description]]),
                price: 0,
                stock: 99999
            }],
            supplier: buyerId,
            status: "ACTIVE"
        });
    }

    const buyingRequest = await BuyingRequest.create({
        buyer: buyerId,
        product: productObj._id,
        variant: productObj.variants[0]._id,
        quantity: data.quantity,
        location: data.location || "حسب الاتفاق مع المورد",
        notes: description,
        purchaseType: data.purchaseType || "GROUP"
    });

    if (data.purchaseType === "GROUP") {
        try {
            await createBuyingPool(buyingRequest._id, buyerId);
        } catch (poolErr) {
            console.error("Auto pool create/join error:", poolErr);
        }
    }

    await buyingRequest.populate("product", "name category images variants description");
    await buyingRequest.populate("buyer", "name email");

    return buyingRequest;
};


const getMyBuyingRequests = async (userId, userRole = "BUYER") => {

    checkValidId(userId, "user");

    let filter = {};
    if (userRole === "BUYER") {
        filter.buyer = userId;
    } else if (userRole === "SUPPLIER") {
        filter.purchaseType = "DIRECT";
        filter.status = "OPEN";
    }

    const buyingRequests = await BuyingRequest.find(filter)
        .populate(
            "product",
            "name category images variants description"
        )
        .populate(
            "buyer",
            "name email companyName"
        )
        .sort({
            createdAt: -1
        });

    return buyingRequests;
};


const getBuyingRequestById = async (id, userId, userRole = "BUYER") => {

    checkValidId(id, "buying request");

    let filter = { _id: id };
    if (userRole === "BUYER") {
        filter.buyer = userId;
    }

    const buyingRequest = await BuyingRequest.findOne(filter)
        .populate(
            "product",
            "name category images variants description"
        )
        .populate(
            "buyer",
            "name email companyName"
        );

    if (!buyingRequest) {
        throw new AppError(
            "Buying request not found",
            404
        );
    }

    const offers = await SupplierOffer.find({ buyingRequest: id })
        .populate("supplier", "name email companyName");

    const result = buyingRequest.toObject();
    result.offers = offers;

    return result;
};


const updateBuyingRequest = async (
    id,
    buyerId,
    data
) => {

    checkValidId(id, "buying request");
    checkValidId(buyerId, "buyer");

    const buyingRequest = await BuyingRequest.findOne({
        _id: id,
        buyer: buyerId
    });

    if (!buyingRequest) {
        throw new AppError(
            "Buying request not found",
            404
        );
    }

    if (buyingRequest.status !== "OPEN") {
        throw new AppError(
            "Only open buying requests can be updated",
            400
        );
    }

    if (data.quantity !== undefined) {
        buyingRequest.quantity = data.quantity;
    }

    if (data.location !== undefined) {
        buyingRequest.location = data.location;
    }

    await buyingRequest.save();

    await buyingRequest.populate(
        "product",
        "name category images variants"
    );

    await buyingRequest.populate(
        "buyer",
        "name email"
    );

    return buyingRequest;
};


const cancelBuyingRequest = async (
    id,
    buyerId
) => {

    checkValidId(id, "buying request");
    checkValidId(buyerId, "buyer");

    const buyingRequest = await BuyingRequest.findOne({
        _id: id,
        buyer: buyerId
    });

    if (!buyingRequest) {
        throw new AppError(
            "Buying request not found",
            404
        );
    }

    if (buyingRequest.status !== "OPEN") {
        throw new AppError(
            "Only open buying requests can be cancelled",
            400
        );
    }

    buyingRequest.status = "CANCELLED";

    await buyingRequest.save();

    return buyingRequest;
};


export {
    createBuyingRequest,
    getMyBuyingRequests,
    getBuyingRequestById,
    updateBuyingRequest,
    cancelBuyingRequest
};
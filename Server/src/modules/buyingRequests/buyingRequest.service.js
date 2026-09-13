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
    checkValidId(data.product, "product");
    checkValidId(data.variant, "variant");

    const result = await getProductAndVariant(
        data.product,
        data.variant
    );

    const buyingRequest = await BuyingRequest.create({
        buyer: buyerId,
        product: data.product,
        variant: data.variant,
        quantity: data.quantity,
        location: data.location,
        purchaseType: data.purchaseType
    });

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


const getMyBuyingRequests = async (buyerId) => {

    checkValidId(buyerId, "buyer");

    const buyingRequests = await BuyingRequest.find({
        buyer: buyerId
    })
        .populate(
            "product",
            "name category images variants"
        )
        .populate(
            "buyer",
            "name email"
        )
        .sort({
            createdAt: -1
        });

    return buyingRequests;
};


const getBuyingRequestById = async (id, buyerId) => {

    checkValidId(id, "buying request");
    checkValidId(buyerId, "buyer");

    const buyingRequest = await BuyingRequest.findOne({
        _id: id,
        buyer: buyerId
    })
        .populate(
            "product",
            "name category images variants"
        )
        .populate(
            "buyer",
            "name email"
        );

    if (!buyingRequest) {
        throw new AppError(
            "Buying request not found",
            404
        );
    }

    return buyingRequest;
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
// SupplierOffer Service

// - Belongs to: Member 3

// - createOffer(supplierId, poolId, data): submit a new offer

// - updateOffer(offerId, supplierId, data): update before pool closes

// - withdrawOffer(offerId, supplierId): set status WITHDRAWN

// - getOffersForPool(poolId): list all offers on a pool

// - getMyOffers(supplierId): list all offers created by supplier

// - getOfferById(offerId): get one offer by id

// - checkEligibility(offerId, totalQty): validate MOQ against final quantity


import BuyingPool from "../buyingPools/buyingPool.model.js";
import BuyingRequest from "../buyingRequests/buyingRequest.model.js";
import SupplierOffer from "./supplierOffer.model.js";
import PoolMember from "../poolMembers/poolMember.model.js";
import { createNotification } from "../notifications/notification.service.js";


// ==========================================
// Create Offer
// ==========================================

const createOffer = async (targetId, supplierid, data) => {

  let pool = await BuyingPool.findById(targetId);
  let buyingRequest = null;

  if (!pool) {
    buyingRequest = await BuyingRequest.findById(targetId);
  }

  if (!pool && !buyingRequest) {
    throw new Error("Target pool or buying request not found");
  }

  if (pool && pool.status !== "OPEN_OFFERS") {
    throw new Error("The pool is not accepting offers at this time. Offers can only be submitted during the OPEN_OFFERS phase.");
  }

  if (buyingRequest && buyingRequest.status !== "OPEN") {
    throw new Error("The buying request is not open");
  }

  const query = { supplier: supplierid };
  if (pool) query.pool = targetId;
  if (buyingRequest) query.buyingRequest = targetId;

  const existingOffer = await SupplierOffer.findOne(query);

  if (existingOffer) {
    throw new Error("Supplier already has an offer for this request");
  }

  const payload = {
    supplier: supplierid,
    ...data
  };
  if (pool) payload.pool = targetId;
  if (buyingRequest) payload.buyingRequest = targetId;

  const offer = await SupplierOffer.create(payload);

  try {
    if (buyingRequest && buyingRequest.buyer) {
      await createNotification(
        buyingRequest.buyer,
        "NEW_OFFER",
        "عرض سعر جديد على طلب الشراء الخاص بك",
        `قدم أحد الموردين عرض سعر جديد بقدر ${data.offeredPrice || ''} ج.م على طلبك.`,
        { entityModel: "BuyingRequest", entityId: buyingRequest._id }
      );
    } else if (pool) {
      const members = await PoolMember.find({ pool: targetId, status: "ACTIVE" });
      const notifiedSet = new Set();
      for (const m of members) {
        const uId = m.buyer ? m.buyer.toString() : null;
        if (uId && !notifiedSet.has(uId)) {
          notifiedSet.add(uId);
          await createNotification(
            uId,
            "NEW_OFFER",
            "عرض سعر جديد على تجمع الشراء",
            `قدم أحد الموردين عرض سعر جديد بقدر ${data.offeredPrice || ''} ج.م على التجمع الذي تشارك به.`,
            { entityModel: "BuyingPool", entityId: pool._id }
          );
        }
      }
      if (pool.createdBy && !notifiedSet.has(pool.createdBy.toString())) {
        await createNotification(
          pool.createdBy,
          "NEW_OFFER",
          "عرض سعر جديد على تجمع الشراء",
          `قدم أحد الموردين عرض سعر جديد بقدر ${data.offeredPrice || ''} ج.م على التجمع الخاص بك.`,
          { entityModel: "BuyingPool", entityId: pool._id }
        );
      }
    }
  } catch (notifErr) {
    console.error("Error creating offer notification:", notifErr);
  }

  return offer;
};


// ==========================================
// Update Offer
// ==========================================

const updateOffer = async (offerId, supplierId, data) => {

  const offer = await SupplierOffer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.supplier.toString() !== supplierId.toString()) {
    throw new Error("You are not the owner of this offer");
  }

  const pool = await BuyingPool.findById(offer.pool);

  if (!pool) {
    throw new Error("Pool not found");
  }

  if (pool.status !== "OPEN_OFFERS") {
    throw new Error("The pool is not accepting offers at this time");
  }

  const updatedOffer = await SupplierOffer.findByIdAndUpdate(
    offerId,
    data,
    {
      new: true,
      runValidators: true
    }
  );

  return updatedOffer;
};


// ==========================================
// Withdraw Offer
// ==========================================

const withdrawOffer = async (offerId, supplierId) => {

  const offer = await SupplierOffer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.supplier.toString() !== supplierId.toString()) {
    throw new Error("You are not the owner of this offer");
  }

  const pool = await BuyingPool.findById(offer.pool);

  if (!pool) {
    throw new Error("Pool not found");
  }

  if (pool.status !== "OPEN_OFFERS") {
    throw new Error("The pool is not accepting offers at this time");
  }

  if (offer.status === "WITHDRAWN") {
    throw new Error("Offer is already withdrawn");
  }

  offer.status = "WITHDRAWN";

  await offer.save();

  return offer;
};


// ==========================================
// Get Offers For Pool
// ==========================================

const getOffersForPool = async (poolId) => {

  let pool = await BuyingPool.findById(poolId);
  let buyingRequest = null;
  if (!pool) {
    buyingRequest = await BuyingRequest.findById(poolId);
  }

  if (!pool && !buyingRequest) {
    throw new Error("Pool or buying request not found");
  }

  const query = pool ? { pool: poolId } : { buyingRequest: poolId };

  const offers = await SupplierOffer.find(query).populate("supplier", "name email companyName");

  return offers;
};


// ==========================================
// Get My Offers
// GET /api/supplier-offers/my
// ==========================================

const getMyOffers = async (supplierId) => {

  const offers = await SupplierOffer.find({
    supplier: supplierId
  });

  return offers;
};


// ==========================================
// Get Offer By ID
// GET /api/supplier-offers/:id
// ==========================================

const getOfferById = async (offerId) => {

  const offer = await SupplierOffer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  return offer;
};


// ==========================================
// Check Eligibility
// ==========================================

const checkEligibility = async (offerId, totalQty) => {

  const offer = await SupplierOffer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.status === "WITHDRAWN") {
    throw new Error("Offer is withdrawn");
  }

  if (totalQty >= offer.moq) {
    offer.status = "ELIGIBLE";
  } else {
    offer.status = "INELIGIBLE";
  }

  await offer.save();

  return offer;
};


export {
  createOffer,
  updateOffer,
  withdrawOffer,
  getOffersForPool,
  getMyOffers,
  getOfferById,
  checkEligibility
};
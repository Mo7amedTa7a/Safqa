// SupplierOffer Service
// - Belongs to: Member 3
// - createOffer(supplierId, poolId, data): submit a new offer
// - updateOffer(offerId, supplierId, data): update before pool closes
// - withdrawOffer(offerId, supplierId): set status WITHDRAWN
// - getOffersForPool(poolId): list all offers on a pool
// - checkEligibility(offerId, totalQty): validate MOQ against final quantity


const BuyingPool = require("../buyingPools/buyingPool.model");
const SupplierOffer = require("./supplierOffer.model");

const createOffer = async (poolid, supplierid, data) => {

  const pool = await BuyingPool.findById(poolid);

  if (!pool) {
    throw new Error("Not found pool");
  }

  if (pool.status !== "OPEN") {
    throw new Error("The pool is not open");
  }

  const existingOffer = await SupplierOffer.findOne({
    supplier: supplierid,
    pool: poolid
  });

  if (existingOffer) {
    throw new Error("Supplier already has an offer for this pool");
  }

  const offer = await SupplierOffer.create({
    pool: poolid,
    supplier: supplierid,
    ...data
  });

  return offer;
};

///////////////////////////////////
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

  if (pool.status !== "OPEN") {
    throw new Error("The pool is not open");
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
//////////////////////////////////////////////

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

  if (pool.status !== "OPEN") {
    throw new Error("The pool is not open");
  }

  if (offer.status === "WITHDRAWN") {
    throw new Error("Offer is already withdrawn");
  }

  offer.status = "WITHDRAWN";

  await offer.save();

  return offer;
};

///////////////////////////


const getOffersForPool = async (poolId) => {

  const pool = await BuyingPool.findById(poolId);

  if (!pool) {
    throw new Error("Pool not found");
  }

  const offers = await SupplierOffer.find({
    pool: poolId
  });

  return offers;
};
/////////////////////////////important

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
module.exports = {createOffer,updateOffer,withdrawOffer,getOffersForPool,checkEligibility};
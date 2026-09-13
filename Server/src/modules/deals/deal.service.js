const SupplierOffer = require('../supplierOffers/supplierOffer.model');
const BuyingRequest = require('../buyingRequests/buyingRequest.model');
const BuyingPool = require('../buyingPools/buyingPool.model');
const PoolMember = require('../poolMembers/poolMember.model');
const Deal = require('./deal.model');
const Order = require('./order.model');

function getEffectivePrice(pricingTiers, finalQuantity) {
  const sortedTiers = [...pricingTiers].sort(
    (a, b) => a.minQty - b.minQty
  );

  let selectedTier = null;
  for (const tier of sortedTiers) {
    if (finalQuantity >= tier.minQty) {
      selectedTier = tier;
    }
  }

  if (!selectedTier) {
    return null;
  }

  return selectedTier.unitPrice;
}

function rankEligibleOffers(offers, finalQuantity) {
  const eligibleOffers = offers.filter((offer) => finalQuantity >= offer.moq);

  const offersWithEffectivePrice = eligibleOffers
    .map((offer) => {
      const effectivePrice = getEffectivePrice(offer.pricingTiers, finalQuantity);
      return { offer, effectivePrice };
    })
    .filter((item) => item.effectivePrice !== null);

  offersWithEffectivePrice.sort((a, b) => {
    if (a.effectivePrice !== b.effectivePrice) {
      return a.effectivePrice - b.effectivePrice;
    }
    const ratingA = a.offer.supplier.rating || 0;
    const ratingB = b.offer.supplier.rating || 0;
    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }
    return a.offer.deliveryDays - b.offer.deliveryDays;
  });

  return offersWithEffectivePrice;
}

async function selectBestOffer(poolId, finalQuantity) {
  const offers = await SupplierOffer.find({
    pool: poolId,
    status: 'PENDING',
  }).populate('supplier');

  const ranked = rankEligibleOffers(offers, finalQuantity);

  return ranked.length > 0 ? ranked[0] : null;
}

async function createDealFromPool(poolId) {
  const pool = await BuyingPool.findById(poolId);

  if (!pool) {
    throw new Error('Pool not found');
  }

  const finalQuantity = pool.totalQuantity;

  const bestOfferResult = await selectBestOffer(poolId, finalQuantity);

  if (!bestOfferResult) {
    throw new Error('No eligible offer found for this pool');
  }

  const winningOffer = bestOfferResult.offer;
  const effectivePrice = bestOfferResult.effectivePrice;

  winningOffer.status = 'SELECTED';
  await winningOffer.save();

  await SupplierOffer.updateMany(
    {
      pool: poolId,
      _id: { $ne: winningOffer._id },
      status: 'PENDING',
    },
    { status: 'INELIGIBLE' }
  );

  const deal = await Deal.create({
    pool: poolId,
    selectedOffer: winningOffer._id,
    supplier: winningOffer.supplier._id,
    finalQuantity: finalQuantity,
    effectiveUnitPrice: effectivePrice,
    deliveryDays: winningOffer.deliveryDays,
    status: 'ACTIVE',
  });

  const members = await PoolMember.find({
    pool: poolId,
    status: 'ACTIVE',
  })
  .populate('buyer');

  const orders = [];
  for (const member of members) {
    const order = await Order.create({
      deal: deal._id,
      buyer: member.buyer,
      poolMember: member._id,
      supplier: winningOffer.supplier._id,
      quantity: member.quantity,
      unitPrice: effectivePrice,
      deliveryFee: 0,
      totalAmount: member.quantity * effectivePrice,
      shippingAddress: {
        street: 'TBD',
        city: 'TBD',
        country: 'TBD',
      },
      phone: 'TBD',
      status: 'PENDING',
    });
    orders.push(order);
  }

  return { deal, orders };
}

async function getDeals() {
  const deals = await Deal.find()
    .populate('supplier')
    .populate('selectedOffer')
    .populate('pool');

  return deals;
}

async function getDealById(dealId) {
  const deal = await Deal.findById(dealId)
    .populate('supplier')
    .populate('selectedOffer')
    .populate('pool');

  if (!deal) {
    throw new Error('Deal not found');
  }

  return deal;
}

async function updateDealStatus(dealId, status) {
  const deal = await Deal.findById(dealId);

  if (!deal) {
    throw new Error('Deal not found');
  }

  deal.status = status;

  await deal.save();

  return deal;
}

async function createDealFromRequest(requestId) {
  const request = await BuyingRequest.findById(requestId);

  if (!request) {
    throw new Error('BuyingRequest not found');
  }

  const finalQuantity = request.quantity;

  const offers = await SupplierOffer.find({
    buyingRequest: requestId,
    status: 'PENDING',
  }).populate('supplier');

  const ranked = rankEligibleOffers(offers, finalQuantity);

  if (ranked.length === 0) {
    throw new Error('No eligible offer found for this request');
  }

  const bestOfferResult = ranked[0];
  const winningOffer = bestOfferResult.offer;
  const effectivePrice = bestOfferResult.effectivePrice;

  winningOffer.status = 'SELECTED';
  await winningOffer.save();

  await SupplierOffer.updateMany(
    {
      buyingRequest: requestId,
      _id: { $ne: winningOffer._id },
    },
    { status: 'INELIGIBLE' }
  );

  const deal = await Deal.create({
    selectedOffer: winningOffer._id,
    supplier: winningOffer.supplier._id,
    finalQuantity: finalQuantity,
    effectiveUnitPrice: effectivePrice,
    deliveryDays: winningOffer.deliveryDays,
    status: 'ACTIVE',
  });

  const order = await Order.create({
    deal: deal._id,
    buyer: request.buyer,
    poolMember: null,
    buyingRequest: requestId,
    supplier: winningOffer.supplier._id,
    quantity: finalQuantity,
    unitPrice: effectivePrice,
    deliveryFee: 0,
    totalAmount: finalQuantity * effectivePrice,
    shippingAddress: {
      street: 'TBD',
      city: 'TBD',
      country: 'TBD',
    },
    phone: 'TBD',
    status: 'PENDING',
  });

  return { deal, order };
}

module.exports = { 
  selectBestOffer, 
  getEffectivePrice, 
  rankEligibleOffers, 
  createDealFromPool,
  getDeals,
  getDealById,
  updateDealStatus,
  createDealFromRequest
};
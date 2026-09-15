import AppError from '../../utils/AppError.js';

import SupplierOffer from '../supplierOffers/supplierOffer.model.js';
import BuyingRequest from '../buyingRequests/buyingRequest.model.js';
import BuyingPool from '../buyingPools/buyingPool.model.js';
import PoolMember from '../poolMembers/poolMember.model.js';

import Deal from './deal.model.js';


// ==========================================
// GET EFFECTIVE PRICE
// ==========================================

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


// ==========================================
// RANK ELIGIBLE OFFERS
// ==========================================

function rankEligibleOffers(offers, finalQuantity) {
  const eligibleOffers = offers.filter(
    (offer) => finalQuantity >= offer.moq
  );

  const offersWithEffectivePrice = eligibleOffers
    .map((offer) => {
      const effectivePrice = getEffectivePrice(
        offer.pricingTiers,
        finalQuantity
      );

      return {
        offer,
        effectivePrice,
      };
    })
    .filter(
      (item) => item.effectivePrice !== null
    );

  offersWithEffectivePrice.sort((a, b) => {

    // 1. Lowest effective price
    if (a.effectivePrice !== b.effectivePrice) {
      return a.effectivePrice - b.effectivePrice;
    }

    // 2. Highest supplier rating
    const ratingA =
      a.offer.supplier.rating || 0;

    const ratingB =
      b.offer.supplier.rating || 0;

    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }

    // 3. Fastest delivery
    return (
      a.offer.deliveryDays -
      b.offer.deliveryDays
    );
  });

  return offersWithEffectivePrice;
}


// ==========================================
// SELECT BEST OFFER FOR POOL
// ==========================================

async function selectBestOffer(
  poolId,
  finalQuantity
) {
  const offers = await SupplierOffer.find({
    pool: poolId,
    status: 'PENDING',
  }).populate('supplier');

  const ranked = rankEligibleOffers(
    offers,
    finalQuantity
  );

  return ranked.length > 0
    ? ranked[0]
    : null;
}


// ==========================================
// CREATE DEAL FROM POOL
// ==========================================

async function createDealFromPool(poolId) {
  const pool = await BuyingPool.findById(
    poolId
  );

  if (!pool) {
    throw new AppError(
      'Pool not found',
      404
    );
  }

  const finalQuantity =
    pool.totalQuantity;

  const bestOfferResult =
    await selectBestOffer(
      poolId,
      finalQuantity
    );

  if (!bestOfferResult) {
    throw new AppError(
      'No eligible offer found for this pool',
      400
    );
  }

  const winningOffer =
    bestOfferResult.offer;

  const effectivePrice =
    bestOfferResult.effectivePrice;


  // Mark winning offer as selected
  winningOffer.status = 'SELECTED';

  await winningOffer.save();


  // Mark other offers as ineligible
  await SupplierOffer.updateMany(
    {
      pool: poolId,
      _id: {
        $ne: winningOffer._id,
      },
    },
    {
      status: 'INELIGIBLE',
    }
  );


  // Create Deal only
  // Orders will be created later
  // by each buyer.
  const deal = await Deal.create({
    pool: poolId,

    selectedOffer:
      winningOffer._id,

    supplier:
      winningOffer.supplier._id,

    finalQuantity,

    effectiveUnitPrice:
      effectivePrice,

    deliveryDays:
      winningOffer.deliveryDays,

    status: 'ACTIVE',
  });


  return {
    deal,
  };
}


// ==========================================
// CREATE DIRECT DEAL FROM BUYING REQUEST
// ==========================================

async function createDealFromRequest(
  requestId
) {
  const request =
    await BuyingRequest.findById(
      requestId
    );

  if (!request) {
    throw new AppError(
      'BuyingRequest not found',
      404
    );
  }

  const finalQuantity =
    request.quantity;


  const offers =
    await SupplierOffer.find({
      buyingRequest: requestId,
      status: 'PENDING',
    }).populate('supplier');


  const ranked =
    rankEligibleOffers(
      offers,
      finalQuantity
    );


  if (ranked.length === 0) {
    throw new AppError(
      'No eligible offer found for this request',
      400
    );
  }


  const bestOfferResult =
    ranked[0];

  const winningOffer =
    bestOfferResult.offer;

  const effectivePrice =
    bestOfferResult.effectivePrice;


  // Mark winning offer as selected
  winningOffer.status = 'SELECTED';

  await winningOffer.save();


  // Mark other offers as ineligible
  await SupplierOffer.updateMany(
    {
      buyingRequest: requestId,

      _id: {
        $ne: winningOffer._id,
      },
    },
    {
      status: 'INELIGIBLE',
    }
  );


  // Create Deal only
  // Order will be created later
  // by the buyer.
  const deal = await Deal.create({
    buyingRequest:
      requestId,

    selectedOffer:
      winningOffer._id,

    supplier:
      winningOffer.supplier._id,

    finalQuantity,

    effectiveUnitPrice:
      effectivePrice,

    deliveryDays:
      winningOffer.deliveryDays,

    status: 'ACTIVE',
  });


  return {
    deal,
  };
}


// ==========================================
// GET DEALS
// ==========================================

async function getDeals(user) {

  let filter = {};


  // ========================================
  // ADMIN
  // ========================================

  if (user.role === 'ADMIN') {
    filter = {};
  }


  // ========================================
  // SUPPLIER
  // ========================================

  if (user.role === 'SUPPLIER') {
    filter = {
      supplier: user.id,
    };
  }


  // ========================================
  // BUYER
  // ========================================

  if (user.role === 'BUYER') {

    // Direct buying requests
    const buyingRequests =
      await BuyingRequest.find({
        buyer: user.id,
      }).select('_id');


    const requestIds =
      buyingRequests.map(
        (request) => request._id
      );


    // Group pool memberships
    const poolMembers =
      await PoolMember.find({
        buyer: user.id,
        status: 'ACTIVE',
      }).select('pool');


    const poolIds =
      poolMembers.map(
        (member) => member.pool
      );


    filter = {
      $or: [
        {
          buyingRequest: {
            $in: requestIds,
          },
        },
        {
          pool: {
            $in: poolIds,
          },
        },
      ],
    };
  }


  const deals = await Deal.find(filter)
    .populate('supplier')
    .populate('selectedOffer')
    .populate('pool')
    .populate('buyingRequest');


  return deals;
}


// ==========================================
// CHECK IF BUYER CAN ACCESS DEAL
// ==========================================

async function checkBuyerDealAccess(
  deal,
  buyerId
) {

  // ----------------------------------------
  // Direct Deal
  // ----------------------------------------

  if (deal.buyingRequest) {

    const request =
      await BuyingRequest.findOne({
        _id: deal.buyingRequest,
        buyer: buyerId,
      });

    return !!request;
  }


  // ----------------------------------------
  // Group Deal
  // ----------------------------------------

  if (deal.pool) {

    const poolMember =
      await PoolMember.findOne({
        pool: deal.pool,
        buyer: buyerId,
        status: 'ACTIVE',
      });

    return !!poolMember;
  }


  return false;
}


// ==========================================
// GET DEAL BY ID
// ==========================================

async function getDealById(
  dealId,
  user
) {

  const deal =
    await Deal.findById(dealId)
      .populate('supplier')
      .populate('selectedOffer')
      .populate('pool')
      .populate('buyingRequest');


  if (!deal) {
    throw new AppError(
      'Deal not found',
      404
    );
  }


  // ========================================
  // ADMIN
  // ========================================

  if (user.role === 'ADMIN') {
    return deal;
  }


  // ========================================
  // SUPPLIER
  // ========================================

  if (user.role === 'SUPPLIER') {

    if (
      deal.supplier._id.toString() !==
      user.id.toString()
    ) {
      throw new AppError(
        'Not authorized to access this deal',
        403
      );
    }

    return deal;
  }


  // ========================================
  // BUYER
  // ========================================

  if (user.role === 'BUYER') {

    const hasAccess =
      await checkBuyerDealAccess(
        deal,
        user.id
      );

    if (!hasAccess) {
      throw new AppError(
        'Not authorized to access this deal',
        403
      );
    }

    return deal;
  }


  throw new AppError(
    'Not authorized to access this deal',
    403
  );
}


// ==========================================
// UPDATE DEAL STATUS
// ==========================================

async function updateDealStatus(
  dealId,
  status,
  user
) {

  const deal =
    await Deal.findById(dealId);


  if (!deal) {
    throw new AppError(
      'Deal not found',
      404
    );
  }


  // ========================================
  // ADMIN
  // ========================================

  const isAdmin =
    user.role === 'ADMIN';


  // ========================================
  // SUPPLIER
  // ========================================

  const isSupplier =
    user.role === 'SUPPLIER' &&
    deal.supplier.toString() ===
      user.id.toString();


  if (!isAdmin && !isSupplier) {
    throw new AppError(
      'Not authorized to update this deal',
      403
    );
  }


  deal.status = status;

  await deal.save();


  return deal;
}


export {
  selectBestOffer,
  getEffectivePrice,
  rankEligibleOffers,
  createDealFromPool,
  createDealFromRequest,
  getDeals,
  getDealById,
  updateDealStatus,
};
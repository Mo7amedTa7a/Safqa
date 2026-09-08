// SupplierOffer Model
// - Belongs to: Member 3
// - Fields: pool (ref), supplier (ref: User), moq, pricingTiers[], deliveryDays, warranty, terms
// - pricingTier sub-schema: minQty, unitPrice
// - status: PENDING | ELIGIBLE | INELIGIBLE | WITHDRAWN | SELECTED
// - Index on pool + supplier (unique)

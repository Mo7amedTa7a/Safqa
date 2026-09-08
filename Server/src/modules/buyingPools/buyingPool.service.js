// BuyingPool Service
// - Belongs to: Member 3
// - findOrCreatePool(product, variant): find OPEN pool or create new one with 3-day expiry
// - getPoolById(id): get pool with members and offers
// - closePool(poolId): set status CLOSED, trigger Deal creation (notify Member 4)
// - calculateTotalQuantity(poolId): sum all PoolMember quantities

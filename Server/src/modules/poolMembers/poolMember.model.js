// PoolMember Model
// - Belongs to: Member 3
// - Fields: pool (ref: BuyingPool), buyer (ref: User), buyingRequest (ref), quantity
// - status: ACTIVE | WITHDRAWN
// - Unique index on pool + buyer (one buyer per pool)

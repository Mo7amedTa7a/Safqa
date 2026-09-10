// BuyingRequest Model
// - Belongs to: Member 2
// - Fields: buyer (ref: User), product (ref: Product), variant, quantity
// - purchaseType: DIRECT | GROUP
// - status: PENDING | POOLED | COMPLETED | CANCELLED
// - Index on buyer+status and product+variant

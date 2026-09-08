// Order Model
// - Belongs to: Member 4
// - Fields: deal (ref), buyer (ref: User), poolMember (ref), supplier (ref: User)
// - quantity, unitPrice, deliveryFee, totalAmount
// - shippingAddress: { street, city, country }, phone
// - status: PENDING | CONFIRMED | SHIPPED | DELIVERED | RETURNED | CANCELLED
// - One Order per PoolMember per Deal

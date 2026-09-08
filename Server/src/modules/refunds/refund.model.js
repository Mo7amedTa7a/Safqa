// Refund Model
// - Belongs to: Member 5
// - Fields: order (ref), payment (ref), return (ref optional), buyer (ref: User)
// - amount, reason, status: PENDING | APPROVED | PROCESSED | REJECTED
// - processedAt: timestamp when refund is confirmed

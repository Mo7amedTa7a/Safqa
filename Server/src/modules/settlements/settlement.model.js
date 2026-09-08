// Settlement Model
// - Belongs to: Member 5
// - Fields: deal (ref), supplier (ref: User), totalAmount, commission, netAmount
// - status: HELD | RELEASED | CANCELLED
// - releasedAt: timestamp (after 48-hour protection period)
// - protectionExpiresAt: deliveredAt + 48h

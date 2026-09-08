// Notification Model
// - Belongs to: Member 5
// - Fields: recipient (ref: User), type (enum), message, isRead, metadata (flexible object)
// - type examples: POOL_CLOSED, ORDER_CREATED, SHIPMENT_UPDATE, DISPUTE_OPENED, SETTLEMENT_RELEASED
// - Index on recipient + isRead for unread count queries

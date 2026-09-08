// Dispute Model
// - Belongs to: Member 5
// - Fields: order (ref), buyer (ref: User), reason, description, evidence[]
// - status: OPEN | UNDER_REVIEW | RESOLVED_FOR_BUYER | RESOLVED_FOR_SUPPLIER | CLOSED
// - Must be raised within 48-hour protection window
// - adminNote: admin decision comment

// Settlement Service
// - Belongs to: Member 5
// - createSettlement(dealId): calculate commission and create HELD settlement
// - releaseSettlement(id): release after 48h if no valid dispute
// - holdSettlement(id): keep HELD when valid dispute is raised
// - calculateCommission(totalAmount): apply platform commission rate

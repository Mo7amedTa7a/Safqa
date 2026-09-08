// Deal Service
// - Belongs to: Member 4
// - selectWinner(poolId): run supplier selection algorithm:
//     1. Filter offers eligible by MOQ
//     2. Sort by lowest effective unit price
//     3. Tiebreak: higher supplier rating
//     4. Tiebreak: faster delivery
// - createDeal(poolId, winnerId): create Deal document
// - getDealById(id): get deal details
// - getDealsBySupplier(supplierId): list supplier's deals

// Member 3 - BuyingPool Model
// _id, product, variant, createdBy, totalQuantity, memberCount
// status: 'OPEN' | 'CLOSED'
// startAt, closeAt, createdAt

export interface BuyingPool {
  _id: string;
  product: string;
  variant: string;
  createdBy: string;
  totalQuantity: number;
  memberCount: number;
  startAt: string;
  closeAt: string;
  status: 'OPEN' | 'CLOSED';
  selectedOffer?: string;
}

export interface BuyingPoolListResponse {
  success: boolean;
  data: BuyingPool[];
}

export interface BuyingPoolDetailsResponse {
  success: boolean;
  data: BuyingPool;
}

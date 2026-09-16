// Member 3 - BuyingPool Model
// _id, product, variant, createdBy, totalQuantity, memberCount
// status: 'OPEN' | 'CLOSED'
// startAt, closeAt, createdAt

export interface BuyingPool {
  _id: string;
  product: any;
  variant: any;
  createdBy: any;
  totalQuantity: number;
  memberCount: number;
  startAt: string;
  closeAt: string;
  status: 'OPEN' | 'CLOSED';
  selectedOffer?: string;
  members?: any[];
  offers?: any[];
}

export interface BuyingPoolListResponse {
  success: boolean;
  data: BuyingPool[];
}

export interface BuyingPoolDetailsResponse {
  success: boolean;
  data: BuyingPool;
}

// Create Pool
export interface CreateBuyingPoolRequest {
  buyingRequestId: string;
}

// Pool Member
export interface PoolMember {
  _id: string;
  pool: string;
  buyer: string;
  buyingRequest: string;
  quantity: number;
  status: 'ACTIVE' | 'WITHDRAWN';
}

// Join Pool
export interface JoinPoolResponse {
  success: boolean;
  data: {
    member: PoolMember;
    pool: BuyingPool;
  };
}

// Update Quantity
export interface UpdateQuantityRequest {
  quantity: number;
}

export interface UpdateQuantityResponse {
  success: boolean;
  data: {
    member: PoolMember;
    pool: BuyingPool;
  };
}

// Leave Pool
export interface LeavePoolResponse {
  success: boolean;
  data: {
    member: PoolMember;
    pool: BuyingPool;
  };
}
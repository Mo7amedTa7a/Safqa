// Member 3 - SupplierOffer Model
// _id, pool, supplier, unitPrice, MOQ, deliveryDays, warranty?, terms?
// pricingTiers?: { minQty, maxQty, price }[]
// status: 'ACTIVE' | 'WITHDRAWN' | 'SELECTED' | 'REJECTED'
// createdAt


export interface PricingTier {
  minQty: number;
  unitPrice: number;
}

export interface CreateSupplierOfferRequest {
  moq: number;
  pricingTiers: PricingTier[];
  deliveryDays: number;
  warranty: string;
  terms: string;
}

export interface SupplierOffer {
  _id: string;
  pool: string;
  supplier: string;
  moq: number;
  pricingTiers: PricingTier[];
  deliveryDays: number;
  warranty: string;
  terms: string;
  status: 'PENDING' | 'ELIGIBLE' | 'INELIGIBLE' | 'WITHDRAWN' | 'SELECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierOfferResponse {
  success: boolean;
  data: SupplierOffer;
}